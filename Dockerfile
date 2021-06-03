FROM node:alpine

WORKDIR /app
COPY ./ /app/
COPY ./node_modules /app/node_modules

ENTRYPOINT ["node", "/app/main.js"]
