import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .tasks import get_response, gpt_response, gpt_correction

class ChatConsumer(WebsocketConsumer):
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message_response = gpt_response(text_data_json['text'])
        correction_response = gpt_correction(text_data_json['text'])

        # send user message to front end
        async_to_sync(self.channel_layer.send)(
            self.channel_name,
            {
                "type": "chat_message",
                "text": {"msg": text_data_json["text"], "source": "user"},
            },
        )

        # send chat gpt response to frontend
        async_to_sync(self.channel_layer.send)(
            self.channel_name,
            {
                "type": "chat.message",
                "text": {"msg": message_response, "source": "bot"},
            },
        )

    def chat_message(self, event):
        #text = event["text"]
        text = event["text"]
        self.send(text_data=json.dumps({"text": text}))
