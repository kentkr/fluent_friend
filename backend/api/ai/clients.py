
from dotenv import load_dotenv
from openai import AsyncOpenAI, OpenAI
import os

load_dotenv()

DEEPSEEK_CHAT ='deepseek-chat'
DEEPSEEK = AsyncOpenAI(api_key=os.environ['DEEPSEEK_KEY'], base_url="https://api.deepseek.com")
OPENAI_3_5 ='gpt-3.5-turbo'
OPENAI = AsyncOpenAI(api_key=os.environ['OPENAI_KEY'])

# TODO: remove or refactor other code
MODEL = 'deepseek-chat'
client = OpenAI(api_key=os.environ['DEEPSEEK_KEY'], base_url="https://api.deepseek.com")

