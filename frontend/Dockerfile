# 构建阶段
FROM node:20-alpine AS build
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --no-audit --progress=false

# 复制代码并构建
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 配置 Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]