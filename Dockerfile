From node:16.14.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN tsc --project ./
COPY ./build .

EXPOSE 3000

CMD ["npm", "start"]