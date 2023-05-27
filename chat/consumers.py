import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .tasks import get_response


class ChatConsumer(WebsocketConsumer):
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        get_response.delay(self.channel_name, text_data_json)

        async_to_sync(self.channel_layer.send)(
            self.channel_name,
            {
                "type": "chat_message",
                "text": {"msg": text_data_json["text"], "source": "user"},
            },
        )

        # We will later replace this call with a celery task that will
        # use a Python library called ChatterBot to generate an automated
        # response to a user's input.
        async_to_sync(self.channel_layer.send)(
            self.channel_name,
            {
                "type": "chat.message",
                "text": {"msg": "Bot says hello", "source": "bot"},
            },
        )

    def chat_message(self, event):
        #text = event["text"]
        text = event["text"]
        self.send(text_data=json.dumps({"text": text}))
