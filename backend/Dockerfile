FROM node:20-alpine
WORKDIR /app

# 使用国内镜像源加速包下载
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装依赖
COPY package*.json ./
COPY package-lock.json ./
RUN npm install --registry=https://registry.npmmirror.com

# 复制代码
COPY . .
RUN mkdir -p uploads

EXPOSE 3000
CMD ["npm", "start"]