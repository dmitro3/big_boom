FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY ./.eslintrc.cjs ./
COPY ./vite.config.js ./
COPY ./public ./public
COPY ./index.html ./
COPY ./src ./src

CMD [ "npm", "run", "build" ]
