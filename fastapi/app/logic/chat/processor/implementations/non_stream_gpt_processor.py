import logging
import traceback

import httpx
from fastapi import HTTPException

from app.logic.chat.processor.interfaces.gpt_processor import GPTProcessor


class NonStreamGPTProcessor(GPTProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            completion = self.openai.chat.completions.create(
                messages=self._to_dict(self.messages),
                model=self.model,
                temperature=self.temperature,
                stream=False
            )

            content = completion.choices[0].message.content
            return self.response_handler(content)
        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            text = e.response.text
            raise HTTPException(status_code=status_code, detail=text)
