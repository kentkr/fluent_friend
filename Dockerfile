FROM python:3.11.6-slim-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

# add requirements
COPY ./requirements.txt .
# adding theme/static_src isnt strictly necessary but whatever
RUN mkdir ./theme && mkdir ./theme/static_src/
COPY ./theme/static_src/package.json ./theme/static_src/.

RUN apt-get update -y && \
    apt-get install -y netcat-openbsd && \
    apt-get install -y curl && \
    # use nvm to install node, set nvm home
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install 23.5.0 && \
    nvm use 23.5.0 && \
    npm install --prefix theme/static_src/ && \
    ln -s $(which node) /usr/local/bin/node && \
    ln -s $(which npm) /usr/local/bin/npm && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN chmod +x /code/entrypoint.sh

COPY . .
