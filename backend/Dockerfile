FROM node:20-alpine
WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache python3 make g++

# 安装依赖
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --no-audit --progress=false

# 复制代码
COPY . .
RUN mkdir -p uploads

EXPOSE 3000
CMD ["npm", "start"]