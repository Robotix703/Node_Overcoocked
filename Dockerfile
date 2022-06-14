From node:16.14.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

CMD ["npm", "run build"]
COPY ./build .

EXPOSE 3000

