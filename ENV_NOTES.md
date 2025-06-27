
# backend
lives at `backend/.env(?.<env>)`

```sh
DB_NAME=
DB_USER=
DB_PWD=
DB_HOST=
DB_PORT=

POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PWD}
POSTGRES_DB=${DB_NAME}

DEEPSEEK_KEY=
OPENAI_KEY=

DJANGO_SECRET_KEY=
DJANGO_DEBUG=
# ',' delimited
# this must include frontend host - necessary bc api headers use origin (AllowedHostsOriginValidator)
DJANGO_ALLOWED_HOSTS=

# languagetool api
LT_URL=http://lt:8010/v2
 ```

# frontend
lives at `frontend/.env.<VITE_MODE>`

```sh
# https or wss for dev/prod
VITE_API_URL=""
VITE_WS_URL=""
# url of frontend
VITE_ALLOWED_HOSTS=""
```
