import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

from .tasks import get_gpt_response, get_gpt_correction
import asyncio

class ChatConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data):
        if not hasattr(self, 'message_list'):
            self.message_list = []

        # convert json to string
        data = json.loads(text_data)
        print(data)

        self.message_list += [data]
        print(self.message_list)
        
        asyncio.create_task(self.send_user_message(data['message'], data['message_id']))
        asyncio.create_task(self.send_gpt_message(data['message'], data['message_id']))
        asyncio.create_task(self.send_gpt_correction(data['message'], data['message_id']))

    async def send_user_message(self, message, message_id):
        # add to user message
        user_dict = json.dumps({'message':message, 'source':'user', 'message_id':message_id})
        await self.send(text_data=user_dict)
        self.message_list += user_dict

    async def send_gpt_message(self, message, message_id):
        response = await get_gpt_response(message)
        bot_dict = json.dumps({'message':response, 'source':'bot', 'message_id':message_id})
        await self.send(text_data=bot_dict)
        self.message_list += bot_dict

    async def send_gpt_correction(self, message, message_id):
        response = await get_gpt_correction(message)
        bot_dict = json.dumps({'message':response, 'source':'correction', 'message_id':message_id})
        await self.send(text_data=bot_dict)
        self.message_list += bot_dict

