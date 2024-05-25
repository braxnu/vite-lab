FROM node:20-alpine

WORKDIR /opt
EXPOSE 3000

RUN mkdir -p public
RUN npm i -g npm

ADD ui/package.json ./

RUN npm i --omit=dev

ADD service/dist/server.js ./
ADD ui/dist ./public/

CMD [ "node", "server.js" ]
