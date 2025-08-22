@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    图片查单及排单系统                        ║
echo ║                   一键获得永久网络链接                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🌐 欢迎使用一键部署工具！
echo.
echo 📋 我将帮您快速获得一个永久的网络访问链接
echo    任何人在任何地方都可以通过这个链接访问您的系统
echo.

:menu
echo ════════════════════════════════════════════════════════════════
echo.
echo 🚀 请选择部署方案：
echo.
echo   1. Netlify      - 最简单（推荐）拖拽文件夹即可
echo   2. GitHub Pages - 最稳定，永久免费
echo   3. Vercel       - 最快速，全球加速
echo   4. 查看详细教程
echo   5. 退出
echo.
set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto netlify
if "%choice%"=="2" goto github
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto tutorial
if "%choice%"=="5" goto exit
echo ❌ 无效选项，请重新选择
goto menu

:netlify
cls
echo.
echo 🚀 Netlify 部署方案（最推荐）
echo ════════════════════════════════════════════════════════════════
echo.
echo ✨ 这是最简单的方案，只需要拖拽文件夹！
echo.
echo 📋 操作步骤：
echo   1. 我将为您打开 Netlify 部署页面
echo   2. 将整个 "xitong" 文件夹拖拽到网页的虚线框内
echo   3. 等待 1-2 分钟自动部署
echo   4. 获得永久链接！
echo.
echo 🔗 示例链接：https://amazing-app-123456.netlify.app
echo.
set /p confirm=按 Y 继续，按其他键返回菜单: 
if /i "%confirm%"=="y" (
    echo.
    echo 🌐 正在打开 Netlify 部署页面...
    start https://app.netlify.com/drop
    echo.
    echo ✅ 已打开部署页面！
    echo 💡 请将 xitong 文件夹拖拽到网页中的虚线框内
    echo.
) else (
    goto menu
)
pause
goto menu

:github
cls
echo.
echo 🐙 GitHub Pages 部署方案
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 操作步骤：
echo   1. 我将为您打开 GitHub
echo   2. 创建新仓库（如果没有账号需要先注册）
echo   3. 上传所有文件
echo   4. 在设置中启用 Pages
echo   5. 获得永久链接！
echo.
echo 🔗 示例链接：https://yourname.github.io/image-order-system
echo.
set /p confirm=按 Y 继续，按其他键返回菜单: 
if /i "%confirm%"=="y" (
    echo.
    echo 🌐 正在打开 GitHub...
    start https://github.com/new
    echo.
    echo ✅ 已打开 GitHub！
    echo 💡 请按照页面提示创建仓库并上传文件
    echo.
) else (
    goto menu
)
pause
goto menu

:vercel
cls
echo.
echo ⚡ Vercel 部署方案
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 操作步骤：
echo   1. 我将为您打开 Vercel
echo   2. 拖拽文件夹或连接 GitHub
echo   3. 自动部署
echo   4. 获得高性能链接！
echo.
echo 🔗 示例链接：https://your-project.vercel.app
echo.
set /p confirm=按 Y 继续，按其他键返回菜单: 
if /i "%confirm%"=="y" (
    echo.
    echo 🌐 正在打开 Vercel...
    start https://vercel.com/new
    echo.
    echo ✅ 已打开 Vercel！
    echo 💡 请按照页面提示完成部署
    echo.
) else (
    goto menu
)
pause
goto menu

:tutorial
cls
echo.
echo 📚 详细教程
echo ════════════════════════════════════════════════════════════════
echo.
echo 🌐 正在打开详细部署教程...
start online-deploy-guide.html
echo.
echo ✅ 已打开详细教程！
echo 💡 请按照教程选择最适合您的方案
echo.
pause
goto menu

:exit
cls
echo.
echo 👋 感谢使用图片查单及排单系统！
echo.
echo 💡 小贴士：
echo   • 部署完成后，记得保存您的访问链接
echo   • 可以将链接分享给团队成员使用
echo   • 系统支持手机、平板、电脑访问
echo.
echo 🔗 如需帮助，请查看 README.md 文件
echo.
pause
exit

:error
echo.
echo ❌ 发生错误，请重试
pause
goto menu
