# Base image Node.js
FROM node:18-alpine

# Tạo thư mục app trong container
WORKDIR /app

# Copy package.json và package-lock.json trước
COPY package*.json ./

# Cài dependencies trong container (build đúng cho Linux)
RUN npm install

# Copy toàn bộ source code vào container (trừ node_modules vì đã ignore)
COPY . .

# Expose cổng chạy BE (ví dụ 3000)
EXPOSE 3000

# Lệnh chạy BE
CMD ["npm", "start"]
