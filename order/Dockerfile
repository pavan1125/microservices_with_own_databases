FROM node:latest

WORKDIR /usr/src/order

COPY order/package*.json ./
RUN npm install

COPY order/src/* /usr/src/order/src/

COPY order/prisma /usr/src/order/prisma
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
