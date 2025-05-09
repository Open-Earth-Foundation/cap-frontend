FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1-alpine
COPY --from=build /app/dist/* /usr/share/nginx/html/
COPY --from=build /app/dist/assets/* /usr/share/nginx/html/assets/
# COPY ./nginx.conf /etc/nginx/nginx.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
CMD ["nginx", "-g", "daemon off;"]
