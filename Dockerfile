FROM node:8.11-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

ARG API_URL
ENV API_URL=$API_URL

RUN npm run build

EXPOSE 8080
CMD [ "node", "app.js" ]
