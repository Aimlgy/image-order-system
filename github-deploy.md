# GitHub Pages 部署教程

## 快速部署到GitHub Pages

### 步骤一：准备GitHub仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角 "+" 号，选择 "New repository"
3. 仓库名称输入：`image-order-system`
4. 选择 "Public"（公开仓库）
5. 勾选 "Add a README file"
6. 点击 "Create repository"

### 步骤二：上传文件

#### 方法A：网页上传（推荐新手）

1. 在新创建的仓库页面，点击 "uploading an existing file"
2. 将以下文件拖拽到上传区域：
   - `index.html`
   - `css/style.css`
   - `js/app.js`
   - `js/data.js`
   - `js/utils.js`
   - `README.md`

3. 在页面底部填写提交信息：
   - Commit title: `Initial commit - 图片查单及排单系统`
   - Description: `完整的图片制作流程管理系统`

4. 点击 "Commit changes"

#### 方法B：Git命令行（推荐有经验用户）

```bash
# 克隆仓库到本地
git clone https://github.com/你的用户名/image-order-system.git

# 进入仓库目录
cd image-order-system

# 复制系统文件到仓库目录
# （手动复制或使用命令）

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit - 图片查单及排单系统"

# 推送到GitHub
git push origin main
```

### 步骤三：启用GitHub Pages

1. 在GitHub仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单找到 "Pages"
3. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - Folder 选择 "/ (root)"
4. 点击 "Save"

### 步骤四：访问您的网站

等待1-5分钟后，您的网站将在以下地址可用：

```
https://你的GitHub用户名.github.io/image-order-system
```

例如：如果您的用户名是 `johnsmith`，访问地址就是：
```
https://johnsmith.github.io/image-order-system
```

## 🎉 完成！

现在任何人都可以通过这个链接访问您的图片查单及排单系统了！

### 更新网站

如果需要修改系统，只需：
1. 修改本地文件
2. 重新上传到GitHub仓库
3. 网站会自动更新

### 自定义域名（可选）

如果您有自己的域名，可以在GitHub Pages设置中配置自定义域名。

### 注意事项

- GitHub Pages 是免费服务
- 支持HTTPS加密
- 全球CDN加速
- 99.9%可用性保证
- 每月100GB带宽限制（通常足够使用）

## 其他选择

如果GitHub使用困难，也可以选择：
- **Gitee Pages**（国内）: https://gitee.com
- **Netlify**: https://netlify.com  
- **Vercel**: https://vercel.com
