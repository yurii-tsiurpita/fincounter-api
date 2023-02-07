FROM node:lts-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 2023

ENV NODE_ENV=production

CMD ["node", "./dist/main.js"]