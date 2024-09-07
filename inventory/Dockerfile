FROM node:latest

WORKDIR /usr/src/inventory

COPY inventory/package*.json ./

RUN npm install


COPY inventory/src/* usr/src/inventory/src/
COPY inventory/prisma /usr/src/inventory/prisma

RUN npx prisma generate

EXPOSE 3002

CMD ["npm", "start"]
