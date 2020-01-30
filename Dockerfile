# Mello API Backend Container
FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --silent

COPY . .

EXPOSE 8000
CMD ["npm", "start"]
