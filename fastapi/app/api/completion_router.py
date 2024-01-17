import os
import logging
from typing import Callable, Generator

from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import StreamingResponse
from jose import jwt
from pydantic import BaseModel

from app.logic.completion import ChatCompletionFactory
import app.dao.user_dao as user_dao
import app.util.pricing as pricing

router = APIRouter()


class TextContent(BaseModel):
    type: str
    text: str


class ImageContent(BaseModel):
    type: str
    image_url: str


class Message(BaseModel):
    role: str
    content: str | list[TextContent | ImageContent]


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str
    api_type: str
    temperature: float
    stream: bool


def get_username(authorization: str = Header(...)) -> str:
    if not authorization:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(authorization, os.environ["JWT_SECRET"], algorithms=["HS256"])
        username = payload.get("sub")
        return username
    except jwt.JWTError:
        raise HTTPException(status_code=403)


def fastapi_response_handler(generator_function: Callable[[], Generator[str, None, None]]) -> StreamingResponse:
    return StreamingResponse(generator_function(), media_type='text/plain')


@router.post("/")
async def generate(chat_request: ChatRequest, username: str = Depends(get_username)):
    credit = user_dao.select_credit(username)
    if credit <= 0:
        return f"Insufficient credit for {username}. Please contact author \"windsnow1024@gmail.com\" to recharge."

    logging.info(f"username: {username}, model: {chat_request.model}")

    prompt_tokens = sum(len(message.content) for message in chat_request.messages)
    credit -= pricing.calculate_cost(chat_request.api_type, chat_request.model, prompt_tokens, 0)
    user_dao.update_credit(username, credit)

    factory = ChatCompletionFactory(
        messages=chat_request.messages,
        model=chat_request.model,
        api_type=chat_request.api_type,
        temperature=chat_request.temperature,
        stream=chat_request.stream,
        response_handler=fastapi_response_handler
    )
    completion = factory.create_chat_completion()
    response = completion.process_request()

    return response


class ModelList(BaseModel):
    open_ai_models: list[str]
    azure_models: list[str]


open_ai_models = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-16k-0613",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-0613",
    "gpt-4-1106-preview",
    "gpt-4-vision-preview"
]
azure_models = [
    "gpt-35-turbo",
    "gpt-35-turbo-16k",
    "gpt-4",
    "gpt-4-32k"
]


@router.get("/", response_model=ModelList)
async def get_models() -> ModelList:
    return ModelList(open_ai_models=open_ai_models, azure_models=azure_models)

