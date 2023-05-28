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

@shared_task
async def get_gpt_response(message):

    ## auth open ai
    #openai.api_key = config('open_ai_key')

    #response_json = openai.ChatCompletion.create(
    #    model = 'gpt-3.5-turbo',
    #    messages = [
    #        {"role": "system", "content": 'Have a conversation in the language of the user'},
    #        {"role": "user", "content": message},
    #    ],
    #    n = 1,
    #    max_tokens = 100,
    #    temperature = .7,
    #)

    #message_response = response_json['choices'][0]['message']['content']
    message_response = 'Response!'
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

@shared_task
async def get_gpt_correction(message):

    ## auth open ai
    #openai.api_key = config('open_ai_key')

    #response_json = openai.ChatCompletion.create(
    #    model = 'gpt-3.5-turbo',
    #    messages = [
    #        {"role": "system", "content": 'Correct this message in one line'},
    #        {"role": "user", "content": message},
    #    ],
    #    n = 1,
    #    max_tokens = 100,
    #    temperature = .1,
    #)
    #corrected_message = response_json['choices'][0]['message']['content']
    corrected_message = 'Corrected message'
    corrections = remedy_corrections(message, corrected_message)

    return corrections
