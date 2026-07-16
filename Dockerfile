# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


# Stage 2: Runtime
FROM nginx:alpine

# 1. Copy các file đã build vào thư mục public của Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# 2. COPY THÊM DÒNG NÀY: Chèn file cấu hình Nginx custom của bạn vào
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]