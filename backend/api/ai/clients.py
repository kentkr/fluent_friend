
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

MODEL ='deepseek-chat'
client = OpenAI(api_key=os.environ['DEEPSEEK_KEY'], base_url="https://api.deepseek.com")
#MODEL ='gpt-3.5-turbo'
#client = OpenAI(api_key=os.environ['OPENAI_KEY'])
