from flask import Response
import logging
import os
from openai import OpenAI
from openai import AzureOpenAI


class ChatCompletionFactory:
    def __init__(self, messages, model, api_type, temperature, stream):
        self.messages = messages
        self.model = model
        self.api_type = api_type
        self.temperature = temperature
        self.stream = stream
        self.openai = None

        if api_type == "open_ai":
            self.openai = OpenAI(
                api_key=os.environ["OPENAI_API_KEY"],
            )
        elif api_type == "azure":
            self.openai = AzureOpenAI(
                api_version="2023-07-01-preview",
                azure_endpoint=os.environ["AZURE_API_BASE"],
                api_key=os.environ["AZURE_API_KEY"],
            )

    def create_chat_completion(self):

        if self.stream:
            return StreamChatCompletion(self.model, self.messages, self.temperature, self.api_type, self.openai)
        else:
            return NonStreamChatCompletion(self.model, self.messages, self.temperature, self.api_type, self.openai)


class ChatCompletion:
    def __init__(self, model, messages, temperature, api_type, openai):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.api_type = api_type
        self.openai = openai

    def process_request(self):
        raise NotImplementedError


class NonStreamChatCompletion(ChatCompletion):
    def process_request(self):
        try:
            logging.info("Before completion creation")
            completion = self.openai.chat.completions.create(
                model=self.model,
                messages=self.messages,
                temperature=self.temperature,
                stream=False,
            )
            logging.info("After completion creation")
            logging.info("content: " + completion.choices[0].message.content)
            return completion.choices[0].message.content
        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)


class StreamChatCompletion(ChatCompletion):
    def process_request(self):
        try:
            logging.info("Before completion creation")
            completion = self.openai.chat.completions.create(
                model=self.model,
                messages=self.messages,
                temperature=self.temperature,
                stream=True,
            )
            logging.info("After completion creation")

            def process_delta(completion_delta):
                # Necessary for Azure
                if not completion_delta.choices:
                    return ""

                content_delta = completion_delta.choices[0].delta.content
                if not content_delta:
                    content_delta = ""
                logging.debug(f"chunk: {content_delta}")
                return content_delta

            def generate_chunk():
                content = ""
                for completion_delta in completion:
                    content_delta = process_delta(completion_delta)
                    content += content_delta
                    yield content_delta

                logging.info(f"content: {content}")

            return Response(generate_chunk(), mimetype='text/plain')

        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)
