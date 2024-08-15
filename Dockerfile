FROM node:alpine 

WORKDIR /usr/app

COPY . .

RUN npm install

CMD ["node", "sever.js"]
