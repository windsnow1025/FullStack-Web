import os
import logging
from typing import Callable, Generator

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from jose import jwt
from pydantic import BaseModel

from app.logic.completion import ChatCompletionFactory
import app.dao.user_dao as user_dao
from app.model.message import Message
import app.util.pricing as pricing

router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str
    api_type: str
    temperature: float
    stream: bool


def get_username_from_token(authorization_header: str) -> str:
    if not authorization_header:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(authorization_header, os.environ["JWT_SECRET"], algorithms=["HS256"])
        username = payload.get("sub")
        return username
    except jwt.JWTError:
        raise HTTPException(status_code=403)


def non_stream_handler(content: str, username: str, chat_request: ChatRequest) -> str:
    user_dao.reduce_credit(username, pricing.calculate_cost(chat_request.api_type, chat_request.model, 0, len(content)))
    logging.info(f"content: {content}")
    return content


def stream_handler(
        generator_function: Callable[[], Generator[str, None, None]],
        username: str,
        chat_request: ChatRequest
) -> StreamingResponse:
    def wrapper_generator() -> Generator[str, None, str]:
        content = ""
        for chunk in generator_function():
            content += chunk
            yield chunk
        user_dao.reduce_credit(username, pricing.calculate_cost(chat_request.api_type, chat_request.model, 0, len(content)))
        logging.info(f"content: {content}")
        return content

    return StreamingResponse(wrapper_generator(), media_type='text/plain')


@router.post("/")
async def generate(chat_request: ChatRequest, request: Request):
    authorization_header = request.headers.get("Authorization")
    username = get_username_from_token(authorization_header)

    if user_dao.select_credit(username) <= 0:
        raise HTTPException(status_code=402)

    logging.info(f"username: {username}, model: {chat_request.model}")

    prompt_tokens = sum(len(message["content"]) for message in chat_request.messages)
    user_dao.reduce_credit(username, pricing.calculate_cost(chat_request.api_type, chat_request.model, prompt_tokens, 0))

    factory = ChatCompletionFactory(
        messages=chat_request.messages,
        model=chat_request.model,
        api_type=chat_request.api_type,
        temperature=chat_request.temperature,
        stream=chat_request.stream,
        non_stream_handler=lambda content: non_stream_handler(content, username, chat_request),
        stream_handler=lambda generator_function: stream_handler(generator_function, username, chat_request)
    )
    completion = factory.create_chat_completion()
    response = completion.process_request()

    return response


@router.get("/")
async def get_models() -> list[dict]:
    return pricing.model_pricing_data
