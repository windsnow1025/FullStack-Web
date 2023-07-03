from flask import Flask, request, Response
from waitress import serve
from retry import retry

import openai
import logging
import os
import concurrent.futures
import jwt

app = Flask(__name__)


@app.route("/", methods=["POST"])
def generate():

    # Verify the JWT
    token = request.form.get("token")
    logging.info(f"token: {token}")
    try:
        decoded = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
        logging.info(f"decoded: {decoded}")
    except Exception as e:
        logging.error(f"jwt.decode error: {e}")
        return str(e)

    messages = request.form.get("messages")
    messages = list(eval(messages))
    model = request.form.get("model")
    temperature = request.form.get("temperature")
    temperature = float(temperature)
    stream = request.form.get("stream")
    stream = True if stream == "true" else False

    api_key = os.environ["OPENAI_API_KEY"]
    openai.api_key = api_key

    logging.info(f"model: {model}, messages: {messages}")

    try:
        # Stream mode off
        if stream is False:
            logging.info("Before calling openai.ChatCompletion.create")
            completion = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=temperature,
                stream=stream,
            )
            logging.info("After calling openai.ChatCompletion.create")
            logging.info("content: " + completion.choices[0]["message"]["content"])
            return completion.choices[0]["message"]["content"]

        # Stream mode on
        @retry(tries=5, delay=2, backoff=2, max_delay=10, jitter=(0, 1))
        def create_completion_with_retry():
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(openai.ChatCompletion.create,model=model,messages=messages,temperature=temperature,stream=stream)
                try:
                    return future.result(timeout=5)
                except concurrent.futures.TimeoutError:
                    raise Exception("Function timed out")

        logging.info("Before calling openai.ChatCompletion.create")
        completion = create_completion_with_retry()
        logging.info("After calling openai.ChatCompletion.create")

        def process_delta(completion_delta):
            delta = completion_delta['choices'][0]['delta']
            content_delta = delta.get('content', '')
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
        logging.error(f"openai.ChatCompletion.create error: {e}")
        return str(e)


@app.route("/", methods=["GET"])
def index():
    return "gpt-4-0314"


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    serve(app, host="0.0.0.0", port=5000)
