<div align="center">

# 📋 ProjectFlow

### 现代化全栈项目管理系统

*基于 FastAPI + Vue 3 + PostgreSQL 构建的功能完备的项目管理系统*

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ 核心功能

<table>
<tr>
<td width="50%">

### 📊 智能仪表盘
实时项目统计、进度图表与活动时间线，项目全景一目了然

### 📁 项目管理
项目全生命周期管理，支持进度追踪、状态筛选与团队协作

### ✅ 任务管理
任务分配与追踪、优先级管理、状态流转与多维度筛选

### 📝 日报管理
每日工作记录，支持历史查看与一键 PDF 导出

</td>
<td width="50%">

### 🔔 通知中心
实时消息推送、分类筛选与已读/未读状态管理

### ⚙️ 设置中心
主题切换、通知偏好设置与数据导入/导出

### 🔐 安全认证
JWT Token 认证、bcrypt 密码加密与完善的权限控制

### 📎 文件附件
MinIO S3 兼容存储，预签名 URL 直传，安全高效

</td>
</tr>
</table>

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ES6+ | 原生模块化开发（无框架版本） |
| ![Vue.js](https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white) | 3.4 | 渐进式迁移版本，Composition API |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 4.x | 原子化 CSS，响应式设计 |
| ![Chart.js](https://img.shields.io/badge/-Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white) | 4.4 | 数据可视化图表 |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 5.x | 下一代前端构建工具 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | 3.12 | 主要开发语言 |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | 0.104 | 高性能异步 Web 框架 |
| ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white) | 2.0 | ORM 数据库映射 |
| ![Pydantic](https://img.shields.io/badge/-Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white) | 2.5 | 数据校验与序列化 |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | - | 无状态身份认证 |

### 数据存储

| 技术 | 版本 | 说明 |
|------|------|------|
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | 16 | 主数据库，支持复杂查询 |
| ![MinIO](https://img.shields.io/badge/-MinIO-C72E49?style=flat-square&logo=minio&logoColor=white) | Latest | S3 兼容对象存储 |
| ![LocalStorage](https://img.shields.io/badge/-LocalStorage-FF9800?style=flat-square&logo=html5&logoColor=white) | - | 前端离线数据缓存 |

### 运维部署

| 技术 | 说明 |
|------|------|
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | 容器化部署 |
| ![Docker Compose](https://img.shields.io/badge/-Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white) | 多服务编排 |
| ![Alembic](https://img.shields.io/badge/-Alembic-6BA81E?style=flat-square) | 数据库迁移管理 |

---

## 🚀 快速开始

### 方式一：Docker Compose（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/projectflow.git
cd projectflow

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库密码与 JWT 密钥

# 3. 启动全部服务
docker compose up -d --build

# 4. 访问应用
# 前端页面: http://localhost:8080/pm.html
# API 文档: http://localhost:8000/docs
# MinIO 控制台: http://localhost:9001
```

### 方式二：纯前端运行（无需后端）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm start
# 访问 http://localhost:8080/pm.html
```

> 💡 前端支持离线模式，数据保存在 LocalStorage 中

### 方式三：Vue 3 版本

```bash
# 进入 Vue 迁移目录
cd vue-migration

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

---

## 📂 项目结构

```
projectflow/
├── 📄 pm.html                    # 前端主页面
├── 📄 docker-compose.yml         # Docker 编排配置
├── 📄 package.json               # 前端依赖
│
├── 📁 js/                        # 前端 JavaScript 模块
│   ├── main.js                   # 应用入口
│   └── modules/
│       ├── router.js             # 前端路由
│       ├── dataService.js        # 状态管理
│       ├── backendSync.js        # 后端 API 同步
│       ├── projects.js           # 项目管理
│       ├── tasks.js              # 任务管理
│       └── ...
│
├── 📁 backend/                   # FastAPI 后端
│   ├── app/
│   │   ├── main.py               # FastAPI 入口
│   │   ├── core/                 # 配置、安全、依赖
│   │   ├── models/               # SQLAlchemy 模型
│   │   ├── schemas/              # Pydantic 模式
│   │   └── api/routes/           # API 路由
│   └── ...
│
└── 📁 vue-migration/             # Vue 3 版本
    └── src/
        ├── views/                # 页面组件
        ├── stores/               # Pinia 状态管理
        └── ...
```

---

## 🔌 API 概览

完整 API 文档访问 `http://localhost:8000/docs`

### 认证

| 方法 | 接口 | 说明 |
|------|------|------|
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/login` | 用户登录 (OAuth2 表单) |

### 项目

| 方法 | 接口 | 说明 |
|------|------|------|
| GET | `/projects` | 项目列表 |
| POST | `/projects` | 创建项目 |
| GET | `/projects/{id}` | 项目详情 |
| PATCH | `/projects/{id}` | 更新项目 |
| DELETE | `/projects/{id}` | 删除项目 |

### 任务

| 方法 | 接口 | 说明 |
|------|------|------|
| GET | `/tasks` | 任务列表（支持筛选） |
| POST | `/tasks` | 创建任务 |
| PATCH | `/tasks/{id}` | 更新任务 |
| DELETE | `/tasks/{id}` | 删除任务 |

---

## 📄 开源协议

本项目基于 [MIT 协议](LICENSE) 开源。

---

## 📞 联系方式

- **作者**：Lynn Yan（严雪）
- **邮箱**：yanxue6886@163.com
- **博客**：[CSDN](https://blog.csdn.net/weixin_45560266)

---

<div align="center">

**如果这个项目对你有帮助，欢迎点个 ⭐ Star！**

Made with ❤️ by Lynn

</div>
