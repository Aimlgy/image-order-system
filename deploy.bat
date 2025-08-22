@echo off
echo ====================================
echo 图片查单及排单系统 - 本地服务器启动
echo ====================================
echo.

echo 正在检查Python环境...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到Python，请先安装Python
    echo 下载地址: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [成功] Python环境已就绪
echo.

echo 正在启动本地服务器...
echo 服务器地址: http://localhost:8000
echo 局域网地址: http://%COMPUTERNAME%.local:8000
echo.
echo 按 Ctrl+C 停止服务器
echo ====================================
echo.

python -m http.server 8000
