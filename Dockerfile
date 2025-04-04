# Stage 1: сборка фронтенда с помощью Node и Vite
FROM node:16-alpine AS builder
WORKDIR /app

# Копируем package.json и lock-файл (если есть)
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
