FROM python:3.11.6-slim-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY ./requirements.txt .

RUN apt-get update -y && \
    apt-get install -y netcat-openbsd && \
    apt-get install -y nodejs && \
    apt-get install -y npm && \
    npm install && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN chmod +x /code/entrypoint.sh

COPY . .
