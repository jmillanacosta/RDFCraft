# NextJs - FastAPI starter template

This is a starter template for a NextJs frontend with a FastAPI backend.

## How to use

You can develop the frontend and backend separately.

To call the backend from the frontend, just prefix the endpoint with `/api`.

```js
const res = await fetch('/api/hello')
```

## Development

### Development requirements

- NodeJS

- Python

### How to run

- Frontend

On the root folder:

 First Time

```bash
npm install
```

Run

```bash
npm run dev
```

- Backend

In the backend folder:

First Time

```bash
pip install -r requirements.txt
```

Run

```bash
uvicorn main:app --reload
```

On development, because of the CORS, you need to run browser with security disabled.

(VSCode configuration is already set to run Chrome with security disabled)

## Deployment

### Deploy requirements

- Docker

### How to deploy

```bash
docker-compose up
```

It will run on port 8080.
