FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY ./.eslintrc.cjs ./
COPY ./vite.config.js ./

CMD [ "npm", "run", "start", "--host" ]
