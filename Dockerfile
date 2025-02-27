FROM node:lts-alpine AS frontend-build

WORKDIR /app

ENV DEBUG=1

COPY ./app/package.json ./app/package-lock.json \
 ./app/tsconfig.json ./app/tsconfig.app.json ./app/tsconfig.node.json \
  ./app/vite.config.ts ./app/index.html ./

RUN npm install

COPY ./app/src ./src

RUN npm run build

CMD ["node", "./app/index.html"]

EXPOSE 8000