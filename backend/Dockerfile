FROM node:20-alpine
WORKDIR /app

# 使用国内镜像源加速包下载
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装构建依赖（sqlite3 需要编译）
RUN apk add --no-cache python3 make g++

# 先设置环境变量（关键！解决卡住问题）
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
ENV NPM_CONFIG_FOREGROUND_SCRIPTS=true
ENV NPM_CONFIG_DISABLE_SPAWN=true
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

# 设置sqlite3二进制文件镜像源（加速GitHub下载）
ENV SQLITE_BINARY_SITE=https://npmmirror.com/mirrors/sqlite3

# 安装依赖
COPY package*.json ./
COPY package-lock.json ./
RUN npm install --verbose --unsafe-perm

# 复制代码
COPY . .
RUN mkdir -p uploads data

EXPOSE 3000
CMD ["npm", "start"]
