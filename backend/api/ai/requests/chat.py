
from openai import OpenAI
from typing import List


def chat(client: OpenAI, prompt: str, message: str, message_history: List) -> str | None:
    # TODO: i think we need to modify the role types for the message history
    sys_msg = {
        'role': 'developer',
        'content': prompt
    }
    message_history.insert(0, sys_msg)

    user_msg = {
        'role': 'user',
        'content': message
    }
    message_history.append(user_msg)

    res = client.chat.completions.create(
        model = 'gpt-3.5-turbo',
        messages = message_history, 
        n = 1,
        max_tokens = 200,
        temperature = 1,
        presence_penalty = 1,
    ) 

    return res.choices[0].message.content
