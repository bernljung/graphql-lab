FROM node:11-alpine

WORKDIR /opt/app

COPY package.json /opt/app/package.json

RUN npm install

COPY src /opt/app/src

CMD ["npm", "run", "start"]