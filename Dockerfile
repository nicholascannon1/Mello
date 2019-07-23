# Mello API Backend Container
FROM node:latest

COPY . /app
WORKDIR /app

ENV NODE_ENV production
RUN npm install --production

EXPOSE 8000

CMD ["npm", "start"]