from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Union
from jose import JWTError, jwt

import logging
import os

from completion import ChatCompletionFactory

app = FastAPI()


class ChatRequest(BaseModel):
    messages: List[Union[str, dict]]
    model: str
    api_type: str
    temperature: float
    stream: bool


# JWT configurations
SECRET_KEY = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# JWT authentication
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username


def fastapi_response_handler(generator):
    return StreamingResponse(generator(), media_type='text/plain')


@app.post("/")
async def generate(chat_request: ChatRequest, current_user: str = Depends(get_current_user)):
    logging.info(f"username: {current_user}, model: {chat_request.model}")

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
    open_ai_models: List[str]
    azure_models: List[str]


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


@app.get("/", response_model=ModelList)
def get_models():
    return ModelList(open_ai_models=open_ai_models, azure_models=azure_models)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')