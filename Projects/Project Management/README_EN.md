<div align="center">

# 📋 ProjectFlow

### Modern Full-Stack Project Management System

*A feature-complete project management system built with FastAPI + Vue 3 + PostgreSQL*

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

English | [简体中文](./README.md)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Smart Dashboard
Real-time project statistics, progress charts, and activity timeline for a complete overview

### 📁 Project Management
Full project lifecycle management with progress tracking, status filtering, and team collaboration

### ✅ Task Management
Task assignment and tracking, priority management, status workflow, and multi-dimensional filtering

### 📝 Daily Reports
Daily work records with history viewing and one-click PDF export

</td>
<td width="50%">

### 🔔 Notification Center
Real-time message push, category filtering, and read/unread status management

### ⚙️ Settings Center
Theme switching, notification preferences, and data import/export

### 🔐 Secure Authentication
JWT Token authentication, bcrypt password encryption, and comprehensive access control

### 📎 File Attachments
MinIO S3-compatible storage with presigned URL direct upload for security and efficiency

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ES6+ | Native modular development, framework-free version |
| ![Vue.js](https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white) | 3.4 | Progressive migration version with Composition API |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 4.x | Utility-first CSS with responsive design |
| ![Chart.js](https://img.shields.io/badge/-Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white) | 4.4 | Data visualization charts |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 5.x | Next-generation frontend build tool |

### Backend

| Technology | Version | Description |
|------------|---------|-------------|
| ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | 3.12 | Primary development language |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | 0.104 | High-performance async web framework |
| ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white) | 2.0 | ORM database mapping |
| ![Pydantic](https://img.shields.io/badge/-Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white) | 2.5 | Data validation and serialization |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | - | Stateless authentication |

### Data Storage

| Technology | Version | Description |
|------------|---------|-------------|
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | 16 | Primary database with complex query support |
| ![MinIO](https://img.shields.io/badge/-MinIO-C72E49?style=flat-square&logo=minio&logoColor=white) | Latest | S3-compatible object storage |
| ![LocalStorage](https://img.shields.io/badge/-LocalStorage-FF9800?style=flat-square&logo=html5&logoColor=white) | - | Frontend offline data cache |

### DevOps

| Technology | Description |
|------------|-------------|
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerized deployment |
| ![Docker Compose](https://img.shields.io/badge/-Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white) | Multi-service orchestration |
| ![Alembic](https://img.shields.io/badge/-Alembic-6BA81E?style=flat-square) | Database migration management |

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/projectflow.git
cd projectflow

# 2. Configure environment variables
cp .env.example .env
# Edit .env file to set database password and JWT secret

# 3. Start all services
docker compose up -d --build

# 4. Access the application
# Frontend: http://localhost:8080/pm.html
# API Docs: http://localhost:8000/docs
# MinIO Console: http://localhost:9001
```

### Option 2: Frontend Only (No Backend Required)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
# Visit http://localhost:8080/pm.html
```

> 💡 The frontend supports offline mode with data stored in LocalStorage

### Option 3: Vue 3 Version

```bash
# Enter Vue migration directory
cd vue-migration

# Install dependencies
npm install

# Start development server
npm run dev
# Visit http://localhost:5173
```

---

## 📂 Project Structure

```
projectflow/
├── 📄 pm.html                    # Frontend main page
├── 📄 docker-compose.yml         # Docker orchestration
├── 📄 package.json               # Frontend dependencies
│
├── 📁 js/                        # Frontend JavaScript modules
│   ├── main.js                   # Application entry
│   └── modules/
│       ├── router.js             # Frontend routing
│       ├── dataService.js        # State management
│       ├── backendSync.js        # Backend API sync
│       ├── projects.js           # Project management
│       ├── tasks.js              # Task management
│       └── ...
│
├── 📁 backend/                   # FastAPI backend
│   ├── app/
│   │   ├── main.py               # FastAPI entry
│   │   ├── core/                 # Config, security, deps
│   │   ├── models/               # SQLAlchemy models
│   │   ├── schemas/              # Pydantic schemas
│   │   └── api/routes/           # API routes
│   └── ...
│
└── 📁 vue-migration/             # Vue 3 version
    └── src/
        ├── views/                # Page components
        ├── stores/               # Pinia state management
        └── ...
```

---

## 🔌 API Overview

Full API documentation available at `http://localhost:8000/docs`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login (OAuth2 form) |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects |
| POST | `/projects` | Create project |
| GET | `/projects/{id}` | Get project details |
| PATCH | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (with filtering) |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Contact

- **Author**: Lynn Yan
- **Email**: yanxue6886@163.com
- **LinkedIn**: [Lynn](https://blog.csdn.net/weixin_45560266?spm=1000.2115.3001.5343)
---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ❤️ by Lynn 

</div>
