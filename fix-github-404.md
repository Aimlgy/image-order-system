# GitHub Pages 404 错误解决指南

## 🚨 当前问题
访问 https://aimlgy.github.io/image-order-system/ 出现 404 错误

## 🔍 可能的原因

### 1. 文件结构问题（最常见）
```
❌ 错误的结构：
image-order-system/
├── xitong/          <- 文件在子文件夹中
│   ├── index.html
│   ├── css/
│   └── js/
└── README.md

✅ 正确的结构：
image-order-system/
├── index.html       <- 必须在根目录
├── css/
├── js/
└── README.md
```

### 2. 分支问题
- GitHub Pages 默认从 `main` 分支部署
- 确保文件在正确的分支上

### 3. Pages 设置问题
- 确认 Pages 功能已启用
- 检查部署来源设置

## 🚀 解决步骤

### 步骤1：检查文件位置
1. 进入您的 GitHub 仓库
2. 确认 `index.html` 在根目录（不在子文件夹中）
3. 如果在 `xitong/` 文件夹中，需要移动到根目录

### 步骤2：重新整理文件结构
如果文件在子文件夹中，按以下方式修复：

#### 方法A：网页操作（推荐）
1. 在 GitHub 仓库页面，进入 `xitong` 文件夹
2. 选择所有文件（index.html, css/, js/ 等）
3. 点击每个文件，选择"Edit"
4. 在文件名前删除 `xitong/` 路径
5. 提交更改

#### 方法B：重新上传
1. 删除当前仓库中的 `xitong` 文件夹
2. 直接上传 `index.html`、`css/`、`js/` 到根目录

### 步骤3：检查 Pages 设置
1. 进入仓库 Settings
2. 找到 "Pages" 选项
3. 确认设置：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. 点击 Save

### 步骤4：等待部署
- 修改后需要等待 1-10 分钟
- GitHub 会自动重新部署

## 📁 正确的文件结构示例

您的仓库根目录应该直接包含：

```
image-order-system/           <- 仓库根目录
├── index.html               <- 主页文件（必须在此位置）
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── data.js
│   └── utils.js
├── README.md
├── auto-deploy.js
└── 其他文件...
```

## 🔧 快速修复命令

如果您使用 Git 命令行：

```bash
# 克隆仓库
git clone https://github.com/aimlgy/image-order-system.git
cd image-order-system

# 如果文件在 xitong 文件夹中，移动到根目录
mv xitong/* ./
rmdir xitong

# 提交更改
git add .
git commit -m "Fix: Move files to root directory for GitHub Pages"
git push origin main
```

## ✅ 验证修复

修复后，您应该能够访问：
- https://aimlgy.github.io/image-order-system/
- 页面应该显示登录界面，而不是 404 错误

## 🚨 如果仍然有问题

### 检查清单：
- [ ] `index.html` 在仓库根目录
- [ ] 文件名大小写正确
- [ ] GitHub Pages 设置正确
- [ ] 等待了足够的部署时间（1-10分钟）

### 备用方案：
如果 GitHub Pages 仍有问题，可以使用：
1. **Netlify**：拖拽文件夹即可部署
2. **Vercel**：连接 GitHub 自动部署
3. **Surge.sh**：命令行一键部署

## 📞 需要帮助？

如果按照上述步骤仍然无法解决：
1. 检查浏览器控制台是否有错误信息
2. 确认所有文件都已正确上传
3. 尝试清除浏览器缓存后重新访问
