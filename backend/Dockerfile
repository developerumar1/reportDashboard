FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY data  ./data
RUN npm install

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
