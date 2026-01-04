# 个人作品集网站 | Personal Portfolio Website

一个简洁、现代的个人作品集网站模板，支持中英双语切换，采用蓝白冷色调设计风格。

A clean, modern personal portfolio website template with Chinese/English bilingual support and a blue-white cool color scheme.

## ✨ 特性 | Features

- 🌐 **中英双语支持** - 自动检测浏览器语言，支持一键切换
- 📱 **响应式设计** - 完美适配移动端、平板和桌面设备
- 🎨 **蓝白冷色调** - 简洁专业的视觉设计
- ⚡ **纯静态部署** - 无需后端，可直接部署到 GitHub Pages
- 🔧 **易于定制** - 清晰的代码结构，方便修改

## 🚀 快速开始 | Quick Start

### 方式一：GitHub Pages 部署

1. Fork 本仓库到你的 GitHub 账号
2. 进入仓库设置 Settings → Pages
3. Source 选择 `main` 分支，目录选择 `/ (root)`
4. 点击 Save，等待几分钟后即可通过 `https://你的用户名.github.io/仓库名` 访问

### 方式二：本地预览

```bash
# 克隆仓库
git clone https://github.com/你的用户名/portfolio.git
cd portfolio

# 使用任意静态服务器预览，例如：
npx serve .
# 或
python -m http.server 8000
```

## 📁 项目结构 | Project Structure

```
portfolio/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── main.js         # 主逻辑
│   └── i18n.js         # 国际化模块
├── locales/
│   ├── zh.json         # 中文文本
│   └── en.json         # 英文文本
├── assets/
│   └── images/         # 图片资源
└── README.md           # 说明文档
```

## 🎨 自定义指南 | Customization Guide

### 1. 修改个人信息

编辑 `locales/zh.json` 和 `locales/en.json` 文件：

```json
{
  "hero": {
    "name": "你的名字",
    "title": "你的职位",
    "bio": "你的个人简介..."
  }
}
```

### 2. 添加技能

在语言文件中修改 `skills` 部分：

```json
{
  "skills": {
    "frontend": ["HTML", "CSS", "JavaScript", "React"],
    "backend": ["Node.js", "Python", "Java"],
    "tools": ["Git", "Docker", "VS Code"]
  }
}
```

### 3. 添加项目

在语言文件中修改 `projects` 部分：

```json
{
  "projects": {
    "items": [
      {
        "title": "项目名称",
        "description": "项目描述",
        "techStack": ["React", "Node.js"],
        "thumbnail": "assets/images/project1.png",
        "demoUrl": "https://demo.example.com",
        "githubUrl": "https://github.com/username/project"
      }
    ]
  }
}
```

### 4. 更换头像

将你的头像图片放入 `assets/images/` 目录，然后在 HTML 中更新图片路径：

```html
<img src="assets/images/your-avatar.jpg" alt="头像" class="avatar">
```

### 5. 修改社交链接

在 `index.html` 中找到社交链接部分，更新为你的链接：

```html
<div class="social-links">
  <a href="https://github.com/你的用户名" target="_blank">GitHub</a>
  <a href="https://linkedin.com/in/你的用户名" target="_blank">LinkedIn</a>
</div>
```

### 6. 自定义配色

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #2563eb;      /* 主色调 */
  --primary-light: #3b82f6;      /* 浅蓝色 */
  --primary-dark: #1d4ed8;       /* 深蓝色 */
  --bg-primary: #ffffff;         /* 背景色 */
  /* ... 更多变量 */
}
```

## 📝 语言切换 | Language Switch

网站支持中英双语：

- **自动检测**：首次访问时根据浏览器语言自动选择
- **手动切换**：点击页面右上角的语言切换按钮
- **记忆功能**：语言偏好会保存到本地存储，下次访问自动恢复

## 🌐 部署到 GitHub Pages | Deploy to GitHub Pages

1. 确保你的仓库是公开的（Public）
2. 进入仓库 Settings → Pages
3. 在 "Build and deployment" 部分：
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
4. 点击 Save
5. 等待几分钟，访问 `https://你的用户名.github.io/仓库名`

### 使用自定义域名

1. 在 Settings → Pages 中添加自定义域名
2. 在仓库根目录创建 `CNAME` 文件，内容为你的域名
3. 在域名服务商处配置 DNS 记录

## 📄 许可证 | License

MIT License - 可自由使用、修改和分发。

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
