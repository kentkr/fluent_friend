from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from chatterbot import ChatBot
from chatterbot.ext.django_chatterbot import settings

channel_layer = get_channel_layer()

# chatgpt imports
import difflib
import openai
from decouple import config

import asyncio
import time
from asgiref.sync import sync_to_async

async def get_gpt_response(message_history):

    ## auth open ai
    async_config = sync_to_async(config)
    openai.api_key = await async_config('open_ai_key')

    async_chat_creation = sync_to_async(openai.ChatCompletion.create)

    messages = [{"role": "system", "content": 'Have a fun conversation in the language of the message. Be a bit crass and amusing.'}]
    messages += message_history

    response_json = await async_chat_creation(
        model = 'gpt-3.5-turbo-0613',
        messages = messages,
        n = 1,
        max_tokens = 100,
        temperature = 1,
        presence_penalty = 1
    )

    message_response = response_json['choices'][0]['message']['content']
    #message_response = 'Response!'
    return message_response

def remedy_corrections(original_message, corrected_message):
    # get seq of separated words
    seq = difflib.SequenceMatcher(None, original_message, corrected_message)

    corrections = ''
    for ops in seq.get_opcodes():
        if ops[0] == 'equal':
            corrections += corrected_message[ops[3]:ops[4]]
        if ops[0] == 'replace':
            corrections += '\u0336'.join(original_message[ops[1]:ops[2]]) + '\u0336'
            corrections += corrected_message[ops[3]:ops[4]]
        if ops[0] == 'insert':
            corrections += corrected_message[ops[3]:ops[4]]
        if ops[0] == 'delete':
            corrections += '\u0336'.join(original_message[ops[1]:ops[2]]) + '\u0336'

    return corrections

async def get_gpt_correction(message):

    ## auth open ai
    async_config = sync_to_async(config)
    openai.api_key = await async_config('open_ai_key')

    async_chat_creation = sync_to_async(openai.ChatCompletion.create)

    system_prompt = """
        In the language that the phrase is written, replace it for spelling and grammar. 
        Be sure to add or replace accent marks if necessary. If the use of a word is 
        incorrect replace it. Do not respond to questions.
    """

    response_json = await async_chat_creation(
        model = 'gpt-3.5-turbo-0613',
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': message}
        ],
        n = 1,
        max_tokens = 100,
        temperature = .1,
    )

    message_response = response_json['choices'][0]['message']['content']

    print(f'Corrected message: {message_response}')
    #corrected_message = 'Corrected message'
    corrections = remedy_corrections(message, message_response)

    return corrections
