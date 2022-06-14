From node:16.14.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install typescript -g

COPY . .
RUN tsc --project ./

EXPOSE 3000

CMD ["npm", "start"]