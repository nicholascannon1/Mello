# Mello Web Container

# **BUILD STAGE**
FROM node:latest as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY . .

ENV SKIP_PREFLIGHT_CHECK=true
RUN npm run build

# **CONTAINER STAGE**
FROM nginx:alpine

COPY --from=builder /app/build /srv/www
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
