FROM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 把三套静态项目复制到 Nginx 网站根目录
COPY ./html .

# 使用自定义 Nginx 配置
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

# 暴露端口
EXPOSE 80

# 标签
LABEL version="1.0" \
      description="扫雷合集 - 原生JS / Vue3 / UniApp 三端合一" \
      maintainer="saolei-suite"
