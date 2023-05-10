FROM debian:bullseye as builder

RUN apt-get update; apt install -y curl pkg-config build-essential

SHELL ["/bin/bash", "--login", "-c"]

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
RUN nvm install 18.10.0

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install && npm run build

FROM python:3.11-bullseye

COPY --from=builder /app /app

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

CMD ["gunicorn"  , "-b", "0.0.0.0:8000", "-t", "5", "app:app"]
