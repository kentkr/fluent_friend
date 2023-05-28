import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

from .tasks import get_gpt_response, get_gpt_correction

class ChatConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data):
        # convert json to string
        message = json.loads(text_data)['text']
        # add to user message
        user_dict = {'text':{'msg':message, 'source':'user'}}
        # immediately send to frontend
        await self.send(text_data=json.dumps(user_dict))

        # get chat gpt response
        gpt_r = await get_gpt_response(message)
        # bot dict
        bot_dict = {'text':{'msg':gpt_r, 'source':'bot'}}
        await self.send(text_data=json.dumps(bot_dict))

        # get correction - dont do aything with it yet
        gpt_correction = await get_gpt_correction(message)
        print(gpt_correction)

