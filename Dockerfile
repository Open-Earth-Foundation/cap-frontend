FROM node:21-alpine3.20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]