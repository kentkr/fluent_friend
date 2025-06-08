
from openai import AsyncOpenAI
from typing import List

def _valid_msg_history(msg_history: List[dict]) -> List[dict]:
    valid = []
    for msg in msg_history:
        d = {}
        if msg['sender'] == 'user':
            d['role'] = 'user'
        else:
            d['role'] = 'assistant'     
        d['content'] = msg['message']
        valid.append(d)
    return valid

async def chat(client: AsyncOpenAI, prompt: str, message: str, message_history: List) -> str | None:
    message_history = _valid_msg_history(message_history)
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

    res = await client.chat.completions.create(
        model = 'gpt-3.5-turbo',
        messages = message_history, 
        n = 1,
        max_tokens = 200,
        temperature = 1,
        presence_penalty = 1,
    ) 

    return res.choices[0].message.content
