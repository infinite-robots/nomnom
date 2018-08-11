FROM node:10

WORKDIR /app

COPY package.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8088
CMD [ "npm", "start" ]