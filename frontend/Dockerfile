# 构建阶段
FROM node:20-alpine AS build
WORKDIR /app

# 使用国内镜像源加速包下载
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装依赖
COPY package*.json ./
RUN npm install --registry=https://registry.npmmirror.com

# 复制代码并构建
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 使用国内镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 配置 Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]