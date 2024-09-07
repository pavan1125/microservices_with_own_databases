FROM node:latest

WORKDIR /usr/src/users

COPY users/package*.json ./

RUN npm install


COPY users/src/* usr/src/users/src/
COPY users/prisma /usr/src/users/prisma

RUN npx prisma generate

EXPOSE 3003

CMD ["npm", "start"]
