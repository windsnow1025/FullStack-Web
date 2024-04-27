import logging

from app.dao import user_dao
from app.logic.chat.handler.request_handler import handle_request
from app.logic.chat.handler.response_handler import stream_handler, non_stream_handler
from app.logic.chat.processor.factory.chat_processor_factory import create_chat_processor
from app.model.message import Message
from app.logic.chat.util import chat_pricing


async def handle_chat_interaction(
        username: str,
        host: str,
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool
):
    logging.info(f"username: {username}, model: {model}")

    def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
        cost = chat_pricing.calculate_chat_cost(
            api_type=api_type,
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens
        )
        user_dao.reduce_credit(username, cost)
        return cost

    handle_request(
        messages,
        lambda prompt_tokens: reduce_credit(prompt_tokens=prompt_tokens, completion_tokens=0)
    )

    processor = await create_chat_processor(
        host=host,
        messages=messages,
        model=model,
        api_type=api_type,
        temperature=temperature,
        stream=stream,
        stream_response_handler=lambda generator_function: stream_handler(
            generator_function,
            lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
        ),
        non_stream_response_handler=lambda content: non_stream_handler(
            content,
            lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
        )
    )
    response = processor.process_request()

    return response
