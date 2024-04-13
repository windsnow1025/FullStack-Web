import os
from io import BytesIO
from typing import Callable, Generator

import PIL.Image
import google.generativeai as genai
import requests
from fastapi.responses import StreamingResponse

from app.logic.chat.processor.gemini.non_stream_gemini_processor import NonStreamGeminiProcessor
from app.logic.chat.processor.gemini.stream_gemini_processor import StreamGeminiProcessor
from app.model.message import Message, GeminiMessage


def create_gemini_processor(
        host: str,
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        stream_response_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
        non_stream_response_handler: Callable[[str], str] = None
):
    genai.configure(api_key=os.environ["GOOGLE_AI_STUDIO_API_KEY"])

    generation_config = {
        "temperature": 0
    }

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        },
    ]

    generative_model = genai.GenerativeModel(
        model_name=f"models/{model}",
        generation_config=generation_config,
        safety_settings=safety_settings
    )

    gemini_messages = convert_messages_to_gemini(messages, host)

    if stream:
        return StreamGeminiProcessor(
            model=generative_model,
            messages=gemini_messages,
            temperature=temperature,
            response_handler=stream_response_handler
        )
    else:
        return NonStreamGeminiProcessor(
            model=generative_model,
            messages=gemini_messages,
            temperature=temperature,
            response_handler=non_stream_response_handler
        )


def convert_messages_to_gemini(messages: list[Message], host: str) -> list[GeminiMessage]:
    return [convert_message_to_gemini(message, host) for message in messages]


def convert_message_to_gemini(message: Message, host: str) -> GeminiMessage:
    if message['role'] == "user" or message['role'] == "system":
        role = "user"
    elif message['role'] == "assistant":
        role = "model"

    parts = []
    content = message['content']

    if isinstance(content, str):
        parts.append(content)
    elif isinstance(content, list):
        for item in content:
            if item['type'] == 'text':
                parts.append(item['text'])
            elif item['type'] == 'image_url':
                img_url = item['image_url']['url']
                img = PIL.Image.open(get_img_data(img_url, host))
                parts.append(img)

    return GeminiMessage(role=role, parts=parts)


def get_img_data(img_url: str, host) -> BytesIO:
    if host.split(':')[0] not in img_url:
        raise Exception("SSRF")
    response = requests.get(img_url)
    response.raise_for_status()
    return BytesIO(response.content)

