FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD NODE_ENV=production npm start
EXPOSE 3001
