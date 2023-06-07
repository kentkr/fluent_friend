import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

from .tasks import get_gpt_response, get_gpt_correction
import asyncio

class ChatConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data):
        # convert json to string
        message = json.loads(text_data)['text']
        
        asyncio.create_task(self.send_user_message(message))
        asyncio.create_task(self.send_gpt_message(message))



        # get correction - dont do aything with it yet
        #gpt_correction = await get_gpt_correction(message)
        # add to user message

    async def task1(self, v):
        await asyncio.sleep(5)
        print('--- task 1 ----')

    async def task2(self, v):
        print('--- task 2 ----')

    async def send_user_message(self, message):
        # add to user message
        user_dict = json.dumps({'text':{'msg':message, 'source':'user', 'correction':'place_holder'}})
        await self.send(text_data=user_dict)

    async def send_gpt_message(self, message):
        response = await get_gpt_response(message)
        bot_dict = json.dumps({'text':{'msg':response, 'source':'bot', 'correction': None}})
        print(bot_dict)
        await asyncio.sleep(2)
        await self.send(text_data=bot_dict)

