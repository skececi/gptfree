from typing import Any, Dict, List, Literal, Optional

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from anthropic import Anthropic
from openai import OpenAI

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LLMMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class MessageRequest(BaseModel):
    messages: List[LLMMessage]
    model: str
    system_prompt: Optional[str] = None


class NameThreadRequest(BaseModel):
    messages: List[LLMMessage]


anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

OPENAI_MODELS = os.getenv("OPENAI_MODELS", "").split(",")
ANTHROPIC_MODELS = os.getenv("ANTHROPIC_MODELS", "").split(",")
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", "")


def get_first_available_model() -> str:
    """
    Returns the first available model from (in order) OpenAI and Anthropic lists.
    Raises ValueError if none are available.
    """
    for model in OPENAI_MODELS + ANTHROPIC_MODELS:
        if model:
            return model
    raise ValueError("No available models")


def get_message_response(
    messages: List[LLMMessage],
    model: str,
    system_prompt: Optional[str] = None,
    max_tokens: Optional[int] = 4096,
) -> Dict[str, Any]:
    """
    Returns a dictionary containing the assistant's response to the provided messages,
    using the specified model and an optional system prompt.
    """
    if model in OPENAI_MODELS:
        message = openai_client.chat.completions.create(
            model=model,
            messages=[{"role": "developer", "content": system_prompt or ""}]
            + [{"role": m.role, "content": m.content} for m in messages],
            max_completion_tokens=max_tokens,
        )
        return {
            "content": message.choices[0].message.content,
            "model": model,
            "role": "assistant",
        }
    elif model in ANTHROPIC_MODELS:
        message = anthropic_client.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            system=system_prompt or "",
        )
        return {
            "content": message.content[0].text,
            "model": model,
            "role": "assistant",
        }
    else:
        raise ValueError(f"Model {model} not supported")


@app.post("/message")
async def post_message(request: MessageRequest) -> Dict[str, Any]:
    """
    Endpoint that returns the chatbot's response to the supplied messages and model.
    """
    response = get_message_response(
        request.messages,
        request.model,
        request.system_prompt or SYSTEM_PROMPT,
    )
    return response


@app.post("/name-thread")
async def name_thread(request: NameThreadRequest) -> Dict[str, Any]:
    """
    Endpoint that returns a short name (max 4 words) for a conversation thread.
    """
    naming_prompt = LLMMessage(
        role="user",
        content=(
            "You are responsible for naming conversation threads. "
            "You will receive an data of an initial message between a user and an assistant. "
            "Please respond with a short name for that conversation, max 4 words. Be specific and concise. "
            "Prefer to use distinct words that standout. "
            "Do not include descriptors like 'thread' or 'chat' or 'conversation' at all. "
            "Examples of good names: "
            "Growth Rate Calculation, Binary Tree Spacing, Pandemic Stock Surges"
        ),
    )
    formatted_messages = [naming_prompt] + request.messages
    response = get_message_response(
        formatted_messages,
        get_first_available_model(),
        SYSTEM_PROMPT,
        max_tokens=6,
    )
    return response


@app.get("/models")
async def get_models() -> List[str]:
    """
    Endpoint returning a list of available models (combined from OpenAI and Anthropic).
    """
    return [m for m in (OPENAI_MODELS + ANTHROPIC_MODELS) if m]


@app.get("/")
async def read_root() -> Dict[str, str]:
    """
    Basic health check endpoint.
    """
    return {"Ping": "It's working :)"}
