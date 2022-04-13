FROM node:alpine
LABEL org.opencontainers.image.source="https://github.com/pesca-dev/moneyboy-backend"

WORKDIR /app

COPY ./build/ /app/
COPY ./node_modules /app/node_modules

ENTRYPOINT ["node", "/app/main.js"]
