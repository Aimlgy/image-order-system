@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                图片查单及排单系统                          ║
echo ║                  本地服务器启动                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 🔍 正在检查运行环境...

:: 检查Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python 已安装
    goto :start_python
)

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js 已安装
    goto :check_serve
)

:: 如果都没有，提供安装建议
echo ❌ 未找到 Python 或 Node.js
echo.
echo 🔧 解决方案：
echo 1. 安装 Python: https://www.python.org/downloads/
echo 2. 安装 Node.js: https://nodejs.org/
echo.
echo 📝 或者直接双击 index.html 文件在浏览器中打开
echo    （但可能某些功能会受限）
echo.
pause
exit /b 1

:check_serve
serve --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 正在安装 serve...
    npm install -g serve
    if %errorlevel% neq 0 (
        echo ❌ serve 安装失败，使用 Python 方式启动
        goto :start_python
    )
)

echo 🚀 使用 Node.js serve 启动服务器...
echo.
echo 📍 本地访问: http://localhost:3000
echo 📍 局域网访问: http://%COMPUTERNAME%:3000
echo.
echo 💡 在浏览器中打开上述任一地址即可访问系统
echo 🛑 按 Ctrl+C 停止服务器
echo ════════════════════════════════════════════════════════════
echo.
serve -s . -l 3000
goto :end

:start_python
echo 🚀 使用 Python 启动服务器...
echo.
echo 📍 本地访问: http://localhost:8000
echo 📍 局域网访问: http://%COMPUTERNAME%:8000
echo.
echo 💡 在浏览器中打开上述任一地址即可访问系统
echo 🛑 按 Ctrl+C 停止服务器
echo ════════════════════════════════════════════════════════════
echo.
python -m http.server 8000

:end
echo.
echo 👋 服务器已停止
pause
