###########
# BUILDER #
###########

FROM python:3.11.6-slim-bullseye as builder

WORKDIR /usr/src/backend

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/backend/wheels -r requirements.txt

#########
# FINAL #
#########

FROM python:3.11.6-slim-bullseye

# create directory for the app user
RUN mkdir -p /home/backend

# create the app user
RUN addgroup --system backend && adduser --system --group backend

# create the appropriate directories
ENV HOME=/home/backend
ENV BACKEND_HOME=/home/backend/backend
RUN mkdir $BACKEND_HOME
WORKDIR $BACKEND_HOME

# install dependencies
COPY --from=builder /usr/src/backend/wheels /wheels
COPY --from=builder /usr/src/backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache /wheels/*

# copy entry point
COPY ./entry_point.sh .
RUN chmod +x $BACKEND_HOME/entry_point.sh

# copy project
COPY . $BACKEND_HOME

# chown all the files to the backend user
RUN chown -R backend:backend $BACKEND_HOME

# change to the backend user
USER backend

ENTRYPOINT ["/home/backend/backend/entry_point.sh"]
