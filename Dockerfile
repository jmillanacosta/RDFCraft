FROM node:lts-alpine AS frontend-build

WORKDIR /app

USER app

ENV DEBUG=1

COPY ./app/package.json ./app/package-lock.json \
 ./app/tsconfig.json ./app/tsconfig.app.json ./app/tsconfig.node.json \
  ./app/vite.config.ts ./app/index.html ./

RUN npm install

COPY ./app/src ./src

RUN npm run build

# Copy the frontend build

COPY --from=frontend-build /app/dist ./public


CMD ["uv", "run", "main.py"]

EXPOSE 8000