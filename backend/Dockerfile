FROM python:3.11.6-slim-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#WORKDIR /code

# add requirements
COPY ./requirements.txt .
# adding theme/static_src isnt strictly necessary but whatever

RUN apt-get update -y && \
    apt-get install -y netcat-openbsd && \
    apt-get install -y curl && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

#COPY ./entrypoint.sh .
#RUN chmod +x /code/entrypoint.sh

#COPY . .
