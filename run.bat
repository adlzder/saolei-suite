@echo off
chcp 65001 >nul
title 扫雷合集 - Docker 一键部署

echo ========================================
echo    💣 扫雷合集 - Docker 一键部署
echo   原生 JS  |  Vue 3  |  UniApp
echo ========================================
echo.

:: 停止并删除旧容器
echo [1/3] 清理旧容器...
docker rm -f saolei-suite 2>nul

:: 构建镜像
echo [2/3] 构建 Docker 镜像...
docker build -t saolei-suite .

:: 运行容器
echo [3/3] 启动容器...
docker run -d --name saolei-suite -p 8084:80 saolei-suite

echo.
echo ========================================
echo   ✅ 部署成功！
echo.
echo   本地访问: http://localhost:8084
echo   外网访问: http://你的公网IP:8084
echo.
echo   游戏入口:
echo     🎯 原生 JS:  http://localhost:8084/native/
echo     ⚡ Vue 3:    http://localhost:8084/vue/
echo     📱 UniApp:   http://localhost:8084/my-h5/
echo.
echo   查看容器状态: docker ps
echo   查看容器日志: docker logs saolei-suite
echo   停止容器:     docker stop saolei-suite
echo   启动容器:     docker start saolei-suite
echo ========================================

pause
