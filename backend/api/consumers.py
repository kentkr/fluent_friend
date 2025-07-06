import json
import asyncio
from typing import Dict, Optional
from channels.generic.websocket import AsyncWebsocketConsumer
from api.ai.requests.chat import chat
from api.ai.requests.correction import corrections
from api.ai.clients import OPENAI
from api.ai.requests.prompts import CHAT_PROMPT, CORRECTION_PROMPT

class ChatConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data: Optional[str] = None, bytes_data: Optional[bytes] = None, close = False) -> None:
        data = {}
        if text_data:
            data = json.loads(text_data)
        elif bytes_data:
            data = json.loads(bytes_data.decode())

        if not data:
            raise Exception(f'Failed to parse any data')

        print('data: ', data)
        asyncio.create_task(self.send_corrections(data))
        asyncio.create_task(self.send_ai_response(data))

    async def send_ai_response(self, data: Dict) -> None:
        ai_response = await chat(OPENAI, CHAT_PROMPT, data['message'], data['messageHistory'])
        # add to user message
        res_obj = {
            'id': data['aiMessageId'],
            'action': 'aiMessage',
            'message': ai_response
        }
        await self.send(text_data=json.dumps(res_obj))

    async def send_corrections(self, data: Dict) -> None:
        correction = await corrections(OPENAI, CORRECTION_PROMPT, data['message'])
        print('correction: ', correction)
        user_correction = {
            'id': data['userMessageId'],
            'action': 'userCorrection',
            'correction': correction
        }
        await self.send(json.dumps(user_correction))


