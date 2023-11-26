
Fluent Friend is a Django web app created to help language learners by allowing them to speak to a "fluent
friend" then giving them corrections on their text. That friend is ChatGPT. Although you can currently speak to ChatGPT in any language, and even
change the prompt so it talks like a "friend", Fluent Friend has one key advantage: the corrections.

The corrections work by sending the user's message to ChatGPT which is prompted to correct it. Then the original and corrected messages are split
by matching words, spaces, and punctuation. The two lists are passed into `difflib.SequenceMatcher()` which matches the text. We loop through
the matches and remedy the corrections. Here's an example

[Desktop Example](examples/example_fr.png)

This web app follows mobile first principles and has reactive elements.

[Mobile Example](examples/example_fr_mobile.png)

# Quick Start

This section may be incomplete as it was not tested. Although it will give a general guide on how to install and run Fluent Friend locally. Start by cloning the repository

```sh
git clone git@github.com:kentkr/fluent_friend.git
cd fluent_friend
```

Create a venv and install dependencies.

```sh
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

Next install node.js, npm, and the tailwindcss dependencies.

```sh
brew install node
npm install
```

Install redis then start it. 

```sh
brew install redis
brew services start redis
```

Now create your .env file (`touch .env`) and fill in `open_ai_key` with your key for chatgpt. Note the database variables are not in use but 
it is set up to be used with postgres.

```
SECRET_KEY=asdf

ALLOWED_HOSTS= .localhost, .herokuapp.com, 0.0.0.0, 127.0.0.1
DEBUG=True

DJANGO_SETTINGS_MODULE=config.settings.development

# Database - currently not used but set up for postgres
DB_NAME=<optional: database name>
DB_USERNAME=<optional: db user>
DB_PASSWORD=
DB_HOSTNAME=localhost
DB_PORT=5432
DATABASE_URL=<optional: db url>

# Redis
REDIS_BACKEND=redis://localhost:6379/0

# open ai
open_ai_key=<your open api key>
```

Now you can run Fluent Friend! This is also in [the runbook](run_book.txt). Build tailwind - this only needs to be run once then can be stopped.

```sh
python3 manage.py tailwind start
```

So cancel the last command or in a new terminal run

```sh
python3 manage.py runserver
```

Now connect to the url shown by the above command.

# Technologies Used

- ChatGPT 3.5-turbo - Used to generate responses and corrected user messages.
- WebSockets using Django Channels - To maintain the connection between the client and the server allowing multiple instances.
- Redis - Used to cache messages on the client side and broker the websocket connections.
- TailwindCSS - To create the user interface.
- PostgreSQL - Not currently used but is set up to store data on the server side.

# Heroku Hosting

This app was originally hosted on Heroku but was turned off due to costs. There are config files that exist in the root of the project that allow it to be hosted easily.

# Contributing

This project is not currently accepting contributions but will in the future. 

# License

This app is licensed under Apache-2.0. It can be modified and repurposed but requires credit to be given to the creator.

# Credit

![earthcomfy/chat-bot](https://github.com/earthcomfy/chat-bot) - This repo and related tutorial gave me the framework to build this app
