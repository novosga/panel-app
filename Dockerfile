FROM node:8 AS build

WORKDIR /app

COPY . /app

RUN npm install && \
    npm run build:web

FROM nginx:alpine

COPY --from=build /app/dist/web /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
