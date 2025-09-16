
## deployment

### local

Create the two env files listed in ENV_NOTES.md

Spin up postgres, redis, and language tool `docker compose up db redis lt`

Set up the backend env and init the database
```sh
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
```

Run the backend `python3 manage.py runserver`. 

Open a new terminal, install frontend dependencies, then start it
```sh
npm install
npm run dev
```

Access the webpage at `http://localhost:5173/`

# raspberrypi

On your host set up ssh with a private key. Then install docker and
remove sudo requirements to run it for your user `sudo usermod -aG docker <user>`

On your local machine create a docker context, use it, build the containers,
then spin them up. Swap out `env` for whatever you named your 
.env files (see ENV_NOTES.md).
```sh
docker context create <env> --docker "host=<ssh_url>"
docker context use <env>
docker compose -f <docker-compose_file> up --build -d
```

Access the webpage at `http://<raspberrypi_host>:3000/`
