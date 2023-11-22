import asyncio
import json
import os

from fastapi.responses import StreamingResponse

from completion import ChatCompletionFactory

# Load configuration from config.json
with open("config.json") as config_file:
    config = json.load(config_file)

os.environ["OPENAI_API_KEY"] = config["OPENAI_API_KEY"]
os.environ["AZURE_API_KEY"] = config["AZURE_API_KEY"]
os.environ["AZURE_API_BASE"] = config["AZURE_API_BASE"]


def fastapi_response_handler(generator):
    return StreamingResponse(generator(), media_type='text/plain')


async def openai_test():
    messages = [
        {
            "role": "user",
            "content": "Say this is a test."
        }
    ]
    model = "gpt-4"
    api_type = "open_ai"
    temperature = 0
    stream = True

    factory = ChatCompletionFactory(messages, model, api_type, temperature, stream, fastapi_response_handler)
    completion = factory.create_chat_completion()
    response = completion.process_request()

    if stream:
        async for content in response.body_iterator:
            print(content, end='')
    else:
        print(response)


def openai_vision_test():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What’s in this image?"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    },
                },
            ],
        }
    ]
    model = "gpt-4-vision-preview"
    api_type = "open_ai"
    temperature = 0
    stream = False

    factory = ChatCompletionFactory(messages, model, api_type, temperature, stream, fastapi_response_handler)
    completion = factory.create_chat_completion()
    response = completion.process_request()

    if stream:
        for content in response.body_iterator:
            print(content, end='')
    else:
        print(response)


asyncio.run(openai_test())
