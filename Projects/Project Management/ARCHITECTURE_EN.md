# 🏗️ ProjectFlow System Architecture

This document describes the technical architecture, design decisions, and implementation details of the ProjectFlow project management system.

---

## 📐 System Architecture Overview

### Overall Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Browser]
        VanillaJS[📄 Vanilla JS Version<br/>pm.html + ES6 Modules]
        VueApp[⚡ Vue 3 Version<br/>Vite + Pinia]
    end
    
    subgraph "API Gateway Layer"
        CORS[CORS Middleware]
        Auth[JWT Auth Middleware]
    end
    
    subgraph "Application Layer"
        FastAPI[🚀 FastAPI<br/>Python 3.12]
        Routes[API Routes]
        Services[Business Logic]
    end
    
    subgraph "Data Layer"
        ORM[SQLAlchemy 2.0<br/>ORM]
        S3Client[Boto3<br/>S3 Client]
    end
    
    subgraph "Storage Layer"
        PG[(🐘 PostgreSQL 16<br/>Primary Database)]
        MinIO[(📦 MinIO<br/>Object Storage)]
        LocalStorage[(💾 LocalStorage<br/>Offline Cache)]
    end
    
    subgraph "Infrastructure"
        Docker[🐳 Docker Compose]
        Alembic[🔄 Alembic<br/>DB Migrations]
    end
    
    Browser --> VanillaJS
    Browser --> VueApp
    VanillaJS --> LocalStorage
    VanillaJS --> CORS
    VueApp --> CORS
    CORS --> Auth
    Auth --> FastAPI
    FastAPI --> Routes
    Routes --> Services
    Services --> ORM
    Services --> S3Client
    ORM --> PG
    S3Client --> MinIO
    Docker --> PG
    Docker --> MinIO
    Docker --> FastAPI
    Alembic --> PG
```

### Deployment Architecture

```mermaid
graph LR
    subgraph "Docker Network"
        subgraph "pm_backend:8000"
            API[FastAPI App]
        end
        subgraph "pm_postgres:5432"
            DB[(PostgreSQL)]
        end
        subgraph "pm_minio:9000/9001"
            Storage[(MinIO)]
        end
    end
    
    Client[Client] -->|HTTP :8080| Static[Static File Server]
    Client -->|HTTP :8000| API
    Client -->|HTTP :9001| Storage
    API -->|TCP :5432| DB
    API -->|HTTP :9000| Storage
```

---

## 🎨 Frontend Architecture

### Vanilla JS Version Architecture

Built with native ES6 modules, no framework dependencies, demonstrating pure JavaScript engineering capabilities.

```mermaid
graph TB
    subgraph "Entry Layer"
        Main[main.js<br/>App Entry]
    end
    
    subgraph "Routing Layer"
        Router[router.js<br/>SPA Router]
    end
    
    subgraph "Data Layer"
        DataService[dataService.js<br/>State Management + Event Bus]
        BackendSync[backendSync.js<br/>API Sync]
    end
    
    subgraph "Business Module Layer"
        Projects[projects.js]
        Tasks[tasks.js]
        Reports[reports.js]
        Dashboard[dashboard.js]
        Notifications[notifications.js]
        Settings[settings.js]
    end
    
    subgraph "UI Component Layer"
        Components[components.js<br/>Modal/Toast/Confirm]
        Charts[charts.js<br/>Chart.js Wrapper]
        Navigation[navigation.js]
    end
    
    subgraph "Utility Layer"
        Loader[loader.js<br/>Lazy Loading]
        A11y[accessibility.js<br/>A11y Support]
        Debug[debug.js<br/>Debug Tools]
    end
    
    Main --> Router
    Main --> DataService
    Router --> Projects
    Router --> Tasks
    Router --> Reports
    Router --> Dashboard
    DataService --> BackendSync
    Projects --> Components
    Tasks --> Components
    Reports --> Components
    Dashboard --> Charts
```

### Core Design Patterns

#### 1. Data Service Layer (DataService)

```javascript
// Singleton Pattern + Observer Pattern
class DataService {
    constructor() {
        this.data = { projects: [], tasks: [], reports: [] };
        this.listeners = new Map();  // Event subscriptions
    }
    
    // Publish-Subscribe Pattern
    on(event, callback) { /* ... */ }
    emit(event, data) { /* ... */ }
    
    // Data Persistence
    saveToStorage() { localStorage.setItem('projectflow-data', JSON.stringify(this.data)); }
    loadFromStorage() { /* ... */ }
}
```

#### 2. Backend Sync Strategy

```javascript
// Strategy Pattern: Backend-first, fallback to local
async function saveTask(taskData) {
    if (isBackendEnabled()) {
        return await backend.createTask(taskData);  // Backend first
    } else {
        return addTaskLocal(taskData);  // Local fallback
    }
}
```

#### 3. Module Communication

```mermaid
sequenceDiagram
    participant User
    participant TaskModule
    participant DataService
    participant BackendSync
    participant UI
    
    User->>TaskModule: Complete Task
    TaskModule->>DataService: updateTaskStatus()
    DataService->>BackendSync: PATCH /tasks/{id}
    BackendSync-->>DataService: Update Success
    DataService->>DataService: emit('taskUpdated')
    DataService->>UI: Trigger UI Update
    UI-->>User: Show Completed Status
```

### Vue 3 Version Architecture

Progressive migration version, demonstrating modern frontend framework capabilities.

```mermaid
graph TB
    subgraph "Vue 3 Application"
        App[App.vue]
        Router[Vue Router 4]
        Pinia[Pinia Store]
    end
    
    subgraph "Views Layer"
        DashboardView[DashboardView]
        ProjectsView[ProjectsView]
        TasksView[TasksView]
        ReportsView[ReportsView]
    end
    
    subgraph "Components Layer"
        Layout[Layout Components<br/>Sidebar/Header]
        Dashboard[Dashboard Components<br/>StatCard/Chart]
        Common[Common Components<br/>Modal/Button]
    end
    
    subgraph "State Management"
        ProjectStore[projectStore]
        TaskStore[taskStore]
        NotificationStore[notificationStore]
    end
    
    subgraph "Service Layer"
        API[api.js<br/>Axios Wrapper]
    end
    
    App --> Router
    App --> Pinia
    Router --> DashboardView
    Router --> ProjectsView
    Router --> TasksView
    Router --> ReportsView
    DashboardView --> Layout
    DashboardView --> Dashboard
    ProjectsView --> Common
    Pinia --> ProjectStore
    Pinia --> TaskStore
    ProjectStore --> API
    TaskStore --> API
```

---

## 🔧 Backend Architecture

### Layered Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        Routes[API Routes<br/>FastAPI Router]
    end
    
    subgraph "Business Layer"
        Auth[Auth Service<br/>JWT + bcrypt]
        CRUD[CRUD Operations]
        S3Service[S3 Service<br/>Presigned URLs]
    end
    
    subgraph "Data Access Layer"
        Models[SQLAlchemy Models]
        Schemas[Pydantic Schemas]
    end
    
    subgraph "Infrastructure Layer"
        DB[Database Session]
        Config[Configuration]
        Deps[Dependencies]
    end
    
    Routes --> Auth
    Routes --> CRUD
    Routes --> S3Service
    Auth --> Models
    CRUD --> Models
    CRUD --> Schemas
    Models --> DB
    DB --> Config
    Routes --> Deps
```

### Directory Structure

```
backend/app/
├── main.py              # FastAPI application entry
├── core/
│   ├── config.py        # Pydantic Settings configuration
│   ├── security.py      # JWT generation/validation, password hashing
│   └── deps.py          # Dependency injection (current user, DB session)
├── models/              # SQLAlchemy ORM models
│   ├── base.py          # Base class (id, created_at, updated_at)
│   ├── user.py
│   ├── project.py
│   ├── task.py
│   ├── task_dependency.py
│   ├── report.py
│   └── attachment.py
├── schemas/             # Pydantic data validation
│   ├── user.py
│   ├── project.py
│   ├── task.py
│   └── ...
├── api/routes/          # API routes
│   ├── auth.py          # Registration/Login
│   ├── projects.py      # Project CRUD
│   ├── tasks.py         # Task CRUD
│   ├── task_dependencies.py  # Task dependencies (Gantt chart)
│   ├── reports.py       # Report CRUD
│   └── attachments.py   # File upload
└── db/
    └── session.py       # Database session management
```

### Security Mechanisms

#### JWT Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Security
    participant DB
    
    Client->>API: POST /auth/login (email, password)
    API->>DB: Query user
    DB-->>API: User data
    API->>Security: verify_password(plain, hashed)
    Security-->>API: Verification result
    API->>Security: create_access_token(user_id)
    Security-->>API: JWT Token
    API-->>Client: { access_token, token_type }
    
    Note over Client,API: Subsequent requests
    Client->>API: GET /projects (Authorization: Bearer token)
    API->>Security: decode_token(token)
    Security-->>API: user_id
    API->>DB: Query user projects
    DB-->>API: Project list
    API-->>Client: Project data
```

#### Password Security

```python
# bcrypt hashing + salt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

### RESTful API Design

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Projects | GET | `/projects` | List (with pagination) |
| Projects | POST | `/projects` | Create |
| Projects | GET | `/projects/{id}` | Details |
| Projects | PATCH | `/projects/{id}` | Partial update |
| Projects | DELETE | `/projects/{id}` | Delete |
| Tasks | GET | `/tasks?project_id=1&q=keyword` | List (with filtering) |
| Attachments | POST | `/attachments/presigned-url` | Get presigned upload URL |

### File Upload Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant MinIO
    
    Client->>API: POST /attachments/presigned-url
    API->>MinIO: generate_presigned_url()
    MinIO-->>API: { upload_url, file_key }
    API-->>Client: { upload_url, file_key }
    
    Client->>MinIO: PUT upload_url (file binary)
    MinIO-->>Client: 200 OK
    
    Client->>API: POST /attachments (metadata)
    API->>API: Save attachment record
    API-->>Client: Attachment info
```

---

## 🗄️ Database Design

### ER Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string name
        string hashed_password
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    PROJECTS {
        int id PK
        string name
        text description
        string status
        int progress
        date deadline
        int team_size
        int owner_id FK
        datetime created_at
        datetime updated_at
    }
    
    TASKS {
        int id PK
        string title
        text description
        string status
        string priority
        int progress
        date start_date
        date end_date
        int project_id FK
        int assignee_id FK
        datetime created_at
        datetime updated_at
    }
    
    TASK_DEPENDENCIES {
        int id PK
        int predecessor_id FK
        int successor_id FK
        string dependency_type
        datetime created_at
    }
    
    REPORTS {
        int id PK
        date date
        string status
        text today_work
        text tomorrow_plan
        text issues
        int project_id FK
        int author_id FK
        datetime created_at
        datetime updated_at
    }
    
    ATTACHMENTS {
        int id PK
        string filename
        string original_filename
        string file_key UK
        bigint file_size
        string content_type
        int task_id FK
        int uploaded_by_id FK
        datetime created_at
    }
    
    USERS ||--o{ PROJECTS : "owns"
    USERS ||--o{ TASKS : "assigned to"
    USERS ||--o{ REPORTS : "authors"
    USERS ||--o{ ATTACHMENTS : "uploads"
    PROJECTS ||--o{ TASKS : "contains"
    PROJECTS ||--o{ REPORTS : "has"
    TASKS ||--o{ ATTACHMENTS : "has"
    TASKS ||--o{ TASK_DEPENDENCIES : "predecessor"
    TASKS ||--o{ TASK_DEPENDENCIES : "successor"
```

### Table Structure Details

#### Users Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Primary key |
| email | VARCHAR | UNIQUE, NOT NULL | Email (login name) |
| name | VARCHAR | NOT NULL | Username |
| hashed_password | VARCHAR | NOT NULL | bcrypt hashed password |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | DEFAULT NOW | Creation time |
| updated_at | TIMESTAMP | ON UPDATE | Update time |

#### Projects Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Primary key |
| name | VARCHAR | NOT NULL | Project name |
| description | TEXT | | Project description |
| status | VARCHAR | CHECK IN ('pending', 'active', 'completed') | Status |
| progress | INTEGER | CHECK 0-100 | Progress percentage |
| deadline | DATE | | Deadline |
| team_size | INTEGER | DEFAULT 1 | Team size |
| owner_id | INTEGER | FK -> users.id | Owner |

#### Tasks Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Primary key |
| title | VARCHAR | NOT NULL | Task title |
| description | TEXT | | Task description |
| status | VARCHAR | CHECK IN ('pending', 'active', 'completed') | Status |
| priority | VARCHAR | CHECK IN ('low', 'medium', 'high') | Priority |
| progress | INTEGER | CHECK 0-100 | Progress |
| start_date | DATE | | Start date |
| end_date | DATE | | End date |
| project_id | INTEGER | FK -> projects.id | Parent project |
| assignee_id | INTEGER | FK -> users.id | Assignee |

### Index Strategy

```sql
-- Task query optimization
CREATE INDEX idx_task_project_status ON tasks(project_id, status);
CREATE INDEX idx_task_project_dates ON tasks(project_id, start_date, end_date);

-- Report query optimization
CREATE INDEX idx_report_project_date ON reports(project_id, date);
CREATE INDEX idx_report_project_status ON reports(project_id, status);

-- User query optimization
CREATE UNIQUE INDEX idx_user_email ON users(email);
```

---

## 🔄 Data Flow

### User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant LocalStorage
    participant FastAPI
    participant Security
    participant PostgreSQL
    
    User->>Frontend: Enter email and password
    Frontend->>FastAPI: POST /auth/login
    FastAPI->>PostgreSQL: SELECT * FROM users WHERE email = ?
    PostgreSQL-->>FastAPI: User record
    FastAPI->>Security: verify_password(input, hashed)
    
    alt Password correct
        Security-->>FastAPI: True
        FastAPI->>Security: create_access_token(user_id)
        Security-->>FastAPI: JWT Token
        FastAPI-->>Frontend: { access_token, token_type: "bearer" }
        Frontend->>LocalStorage: Store Token
        Frontend-->>User: Login success, redirect to dashboard
    else Password incorrect
        Security-->>FastAPI: False
        FastAPI-->>Frontend: 401 Unauthorized
        Frontend-->>User: Show error message
    end
```

### Task CRUD Operation Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant DataService
    participant BackendSync
    participant FastAPI
    participant PostgreSQL
    
    Note over User,PostgreSQL: Create Task
    User->>Frontend: Fill task form, click save
    Frontend->>DataService: addTask(taskData)
    
    alt Backend available
        DataService->>BackendSync: backend.createTask(taskData)
        BackendSync->>FastAPI: POST /tasks (Authorization: Bearer token)
        FastAPI->>PostgreSQL: INSERT INTO tasks ...
        PostgreSQL-->>FastAPI: New task record
        FastAPI-->>BackendSync: 201 Created + task data
        BackendSync-->>DataService: Task data
    else Backend unavailable (offline mode)
        DataService->>DataService: Generate local ID
        DataService->>DataService: Save to LocalStorage
    end
    
    DataService->>DataService: emit('taskAdded', task)
    DataService-->>Frontend: Trigger UI update
    Frontend-->>User: Display new task
```

### Report PDF Export Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Loader
    participant html2canvas
    participant jsPDF
    
    User->>Frontend: Click Export PDF
    Frontend->>Frontend: showNotification('Exporting...')
    Frontend->>Loader: loadPDFLibraries()
    Loader->>Loader: Dynamically load html2canvas
    Loader->>Loader: Dynamically load jsPDF
    Loader-->>Frontend: Libraries loaded
    
    Frontend->>Frontend: Create temporary DOM element
    Frontend->>html2canvas: Render DOM to Canvas
    html2canvas-->>Frontend: Canvas object
    Frontend->>Frontend: canvas.toDataURL('image/png')
    Frontend->>jsPDF: new jsPDF()
    Frontend->>jsPDF: addImage(imgData)
    Frontend->>jsPDF: save('Daily_Report_date.pdf')
    jsPDF-->>User: Download PDF file
    Frontend->>Frontend: Clean up temporary DOM
    Frontend-->>User: showNotification('Export successful')
```

---

## 🎯 Design Patterns & Code Highlights

### Design Patterns Used

| Pattern | Use Case | Implementation Location |
|---------|----------|------------------------|
| **Singleton** | DataService global state management | `js/modules/dataService.js` |
| **Observer** | Event-driven component communication | `DataService.on/emit` |
| **Strategy** | Backend/local storage switching | `backendSync.js` |
| **Factory** | Dynamic UI component creation | `components.js` |
| **Dependency Injection** | FastAPI dependency management | `backend/app/core/deps.py` |
| **Repository** | Data access abstraction | SQLAlchemy Models |
| **Adapter** | Frontend-backend data format conversion | Pydantic Schemas |

### Code Quality Highlights

#### 1. Frontend Modularization

```javascript
// ES6 modules with clear dependencies
import { dataService } from './dataService.js';
import { showNotification } from './notifications.js';
import { modal } from './components.js';

// Export public API
export { setupTaskActions, filterTasks, updateStatisticsDisplay };
```

#### 2. Type Safety (Backend)

```python
# Pydantic data validation
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    priority: Literal["low", "medium", "high"] = "medium"
    project_id: int
    
    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
```

#### 3. Database Constraints

```python
# SQLAlchemy model constraints
__table_args__ = (
    CheckConstraint('progress >= 0 AND progress <= 100', name='check_progress_range'),
    CheckConstraint("status IN ('pending', 'active', 'completed')", name='check_status_values'),
    Index('idx_task_project_status', 'project_id', 'status'),
)
```

#### 4. Accessibility Support

```javascript
// ARIA labels and keyboard navigation
const modal = {
    confirm: async ({ title, message, type }) => {
        // Add ARIA attributes when creating modal
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-labelledby', 'modal-title');
        
        // Focus management
        const firstFocusable = modalEl.querySelector('button');
        firstFocusable?.focus();
    }
};
```

#### 5. Error Handling

```javascript
// Unified error handling and user feedback
try {
    if (isBackendEnabled()) {
        await backend.createTask(taskData);
    } else {
        addTaskLocal(taskData);
    }
    showNotification('Success', 'Task created successfully');
} catch (error) {
    console.error('Failed to save task:', error);
    showNotification('Error', 'An error occurred while saving the task', 'error');
}
```

### Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Lazy Loading | Chart.js, PDF libraries loaded on demand |
| Debouncing | Search input debounced at 200ms |
| Virtual Scrolling | Large lists with pagination |
| Database Indexes | Composite indexes for query optimization |
| Presigned URLs | Direct file upload to MinIO, reducing backend load |

---

## 📚 Related Documentation

- [README.md](../README.md) - Project Introduction (Chinese)
- [README_EN.md](../README_EN.md) - Project Introduction (English)
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) - Demo Script
- [API Documentation](http://localhost:8000/docs) - Swagger UI

---

<div align="center">

*This document is continuously updated*

</div>
