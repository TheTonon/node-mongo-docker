FROM node:latest

ENV app /app

RUN mkdir /app

WORKDIR /app

EXPOSE 3000

COPY package.json .

RUN npm install

COPY ./ .

RUN ls -lah

CMD ['node', "app.js"]