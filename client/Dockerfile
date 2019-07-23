# Mello Frontend container
FROM mellowebbase:latest

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

COPY ./default.conf /etc/nginx/conf.d

EXPOSE 80
# turn daemon off to allow docker to track process
CMD ["nginx", "-g", "daemon off;"]