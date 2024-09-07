FROM node:latest

WORKDIR /usr/src/gateway

COPY gateway/package*.json ./
RUN npm install

COPY gateway/index.js /usr/gateway/index.js

EXPOSE 4000

CMD ["npm", "start"]
