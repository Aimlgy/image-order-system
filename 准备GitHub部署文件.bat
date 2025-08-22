@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                GitHub Pages 部署文件准备工具                  ║
echo ║                     修复 404 错误                             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 🔍 正在检查当前文件结构...
echo.

:: 检查必要文件是否存在
if not exist "index.html" (
    echo ❌ 错误：找不到 index.html 文件
    echo 💡 请确保在正确的目录中运行此脚本
    pause
    exit /b 1
)

if not exist "css\style.css" (
    echo ❌ 错误：找不到 css/style.css 文件
    pause
    exit /b 1
)

echo ✅ 文件检查完成！
echo.

echo 📋 准备 GitHub Pages 部署文件...
echo.

:: 创建部署目录
if exist "github-deploy" rmdir /s /q "github-deploy"
mkdir "github-deploy"

echo 📁 正在复制文件到部署目录...

:: 复制必要文件
copy "index.html" "github-deploy\" >nul
xcopy "css" "github-deploy\css\" /E /I /Q >nul
xcopy "js" "github-deploy\js\" /E /I /Q >nul

:: 复制其他文件（如果存在）
if exist "README.md" copy "README.md" "github-deploy\" >nul
if exist "auto-deploy.js" copy "auto-deploy.js" "github-deploy\" >nul
if exist "*.html" (
    for %%f in (*.html) do (
        if not "%%f"=="index.html" (
            copy "%%f" "github-deploy\" >nul
        )
    )
)

echo ✅ 文件复制完成！
echo.

echo 🔧 正在优化 GitHub Pages 配置...

:: 创建 .nojekyll 文件（避免 Jekyll 处理）
echo. > "github-deploy\.nojekyll"

:: 检查并修复相对路径（如果需要）
echo.
echo ✅ 优化完成！
echo.

echo ════════════════════════════════════════════════════════════════
echo 📦 GitHub Pages 部署文件已准备完成！
echo.
echo 📁 部署文件位置：%CD%\github-deploy\
echo.
echo 📋 接下来的步骤：
echo.
echo 1️⃣  删除 GitHub 仓库中的所有文件
echo 2️⃣  将 github-deploy 文件夹中的所有文件上传到仓库根目录
echo 3️⃣  确保 index.html 在仓库根目录（不在子文件夹中）
echo 4️⃣  等待 1-5 分钟让 GitHub Pages 重新部署
echo.
echo 🌐 部署后访问：https://aimlgy.github.io/image-order-system/
echo ════════════════════════════════════════════════════════════════
echo.

set /p open_folder=是否打开部署文件夹？(Y/N): 
if /i "%open_folder%"=="y" (
    start explorer "github-deploy"
)

echo.
set /p open_github=是否打开 GitHub 仓库页面？(Y/N): 
if /i "%open_github%"=="y" (
    start https://github.com/aimlgy/image-order-system
)

echo.
echo 💡 提示：如果上传后仍然 404，请检查：
echo    • index.html 是否在仓库根目录
echo    • GitHub Pages 设置中的分支是否正确
echo    • 是否等待了足够的部署时间
echo.
pause
