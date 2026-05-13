# PROJECT SYNOPSIS

---

## Project Title
**DevOps Notes Application**
*A Production-Grade Full-Stack Web Application with Complete DevOps Implementation*

---

## Student / Developer
**Nitin Sikarwar**
GitHub: https://github.com/Nitin-Sikarwar/Devops-app-notes

---

## Project Overview

DevOps Notes is a production-ready, cloud-native web application that allows users to securely create, manage, search, and organize their notes. The project is built with a modern full-stack architecture and demonstrates end-to-end DevOps practices including containerization, container orchestration, and automated CI/CD pipelines.

The application is not just a notes tool — it is a complete demonstration of how a real-world software product is built, containerized, deployed, and maintained using industry-standard DevOps tools and practices.

---

## Objectives

- Build a fully functional full-stack web application with user authentication and CRUD operations
- Containerize all application components using Docker with multi-stage builds
- Orchestrate containers using Kubernetes with production-grade configurations
- Implement automated CI/CD pipelines using GitHub Actions
- Follow clean architecture, security best practices, and production deployment standards
- Demonstrate the complete software delivery lifecycle from code to cloud

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework with component-based architecture |
| React Router DOM v6 | Client-side routing and navigation |
| Axios | HTTP client with interceptors for API calls |
| CSS3 | Custom responsive styling with glassmorphism design |
| Nginx | Production static file serving with API proxy |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 | JavaScript runtime environment |
| Express.js 4 | RESTful API framework |
| Sequelize ORM | Database abstraction and model management |
| MySQL 8.0 | Relational database for persistent storage |
| JSON Web Token | Stateless authentication mechanism |
| bcryptjs | Password hashing and security |
| Winston + Morgan | Structured logging and request logging |
| express-validator | Input validation and sanitization |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Application containerization |
| Docker Compose | Multi-container local development |
| Kubernetes | Container orchestration and scaling |
| GitHub Actions | CI/CD pipeline automation |
| Docker Hub | Container image registry |
| Nginx Ingress | Kubernetes traffic routing |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP
┌─────────────────────▼───────────────────────────────────┐
│              NGINX (Port 80)                            │
│         React SPA + API Reverse Proxy                   │
└──────────┬──────────────────────┬───────────────────────┘
           │ Static Files         │ /api/* requests
┌──────────▼──────────┐  ┌───────▼───────────────────────┐
│   React Frontend    │  │    Node.js + Express           │
│   (Built Assets)    │  │    Backend (Port 5000)         │
└─────────────────────┘  └───────────────┬───────────────┘
                                         │ Sequelize ORM
                         ┌───────────────▼───────────────┐
                         │      MySQL 8.0 Database        │
                         │      (Port 3306)               │
                         └───────────────────────────────┘
```

---

## Key Features

### Application Features
- **User Registration & Login** — Secure JWT-based authentication with bcrypt password hashing
- **Create Notes** — Rich note creation with title, content, and comma-separated tags
- **Edit Notes** — Inline editing via modal with pre-filled form data
- **Delete Notes** — Confirmation dialog before permanent deletion
- **Search Notes** — Real-time full-text search across title, content, and tags
- **Pagination** — Server-side pagination with 9 notes per page
- **Responsive UI** — Mobile-first design that works on all screen sizes
- **Professional UI** — Glassmorphism dark theme with animated background

### API Features
- RESTful API design with proper HTTP status codes
- JWT Bearer token authentication on all protected routes
- Input validation and sanitization on all endpoints
- Global error handling middleware
- Health check endpoints (`/health`, `/ready`) for container probes
- Request logging with Morgan and Winston

### DevOps Features
- **Multi-stage Docker builds** — Separate build and production stages for minimal image size
- **Docker Compose** — One-command local development environment
- **Kubernetes manifests** — Complete production deployment configuration
- **Horizontal Pod Autoscaler** — Auto-scaling based on CPU and memory metrics
- **Liveness & Readiness Probes** — Automatic container health monitoring
- **Rolling Updates** — Zero-downtime deployments
- **GitHub Actions CI/CD** — Automated test, build, and push on every git push

---

## Project Structure

```
devops-notes-app/
├── frontend/                  # React.js application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Global auth state (Context API)
│   │   ├── pages/             # Login, Register, Dashboard
│   │   └── services/          # Axios API service layer
│   ├── nginx.conf             # Nginx config with SPA routing
│   └── Dockerfile             # Multi-stage build
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database and logger config
│   │   ├── controllers/       # Business logic handlers
│   │   ├── middleware/        # Auth, logging, error handling
│   │   ├── models/            # Sequelize ORM models
│   │   └── routes/            # API route definitions
│   └── Dockerfile             # Multi-stage build
├── kubernetes/base/           # K8s production manifests
│   ├── namespace.yaml         # Isolated namespace
│   ├── configmap.yaml         # Non-sensitive configuration
│   ├── secrets.yaml           # Sensitive credentials
│   ├── mysql.yaml             # DB with PVC
│   ├── backend.yaml           # API deployment + HPA
│   ├── frontend.yaml          # UI deployment + HPA
│   └── ingress.yaml           # Nginx ingress routing
├── .github/workflows/
│   └── ci-cd.yml              # GitHub Actions pipeline
├── docker-compose.yml         # Local dev environment
└── README.md                  # Complete documentation
```

---

## CI/CD Pipeline

```
Developer pushes code to GitHub (main branch)
              │
              ▼
    ┌─────────────────┐     ┌──────────────────┐
    │  Test Backend   │     │  Test Frontend   │
    │  - npm ci       │     │  - npm ci        │
    │  - syntax check │     │  - npm run build │
    └────────┬────────┘     └────────┬─────────┘
             └──────────┬────────────┘
                        ▼
           ┌────────────────────────┐
           │   Build & Push Images  │
           │  - Docker build        │
           │  - Push to Docker Hub  │
           │  dock0ff/devops-notes- │
           │  backend:latest + SHA  │
           │  dock0ff/devops-notes- │
           │  frontend:latest + SHA │
           └────────────────────────┘
```

---

## Database Schema

### Users Table
| Column | Type | Description |
|---|---|---|
| id | INT (PK) | Auto-increment primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email address |
| password | VARCHAR(255) | bcrypt hashed password |
| created_at | DATETIME | Record creation timestamp |
| updated_at | DATETIME | Record update timestamp |

### Notes Table
| Column | Type | Description |
|---|---|---|
| id | INT (PK) | Auto-increment primary key |
| title | VARCHAR(200) | Note title |
| content | TEXT | Note body content |
| tags | VARCHAR(500) | Comma-separated tags |
| user_id | INT (FK) | Reference to Users table |
| created_at | DATETIME | Record creation timestamp |
| updated_at | DATETIME | Record update timestamp |

---

## REST API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login and get JWT | No |
| GET | /api/auth/me | Get current user | Yes |

### Notes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/notes | Get all notes (search, paginate) | Yes |
| GET | /api/notes/:id | Get single note | Yes |
| POST | /api/notes | Create new note | Yes |
| PUT | /api/notes/:id | Update note | Yes |
| DELETE | /api/notes/:id | Delete note | Yes |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Liveness check |
| GET | /ready | Readiness check with DB ping |

---

## Kubernetes Configuration

| Resource | Details |
|---|---|
| Namespace | `devops-notes` — isolated environment |
| Backend Pods | 2 replicas, scales to 10 on 70% CPU |
| Frontend Pods | 2 replicas, scales to 6 on 70% CPU |
| MySQL | 1 replica with 5Gi PersistentVolumeClaim |
| ConfigMap | Non-sensitive env vars (DB host, port, name) |
| Secrets | Sensitive data (DB password, JWT secret) |
| Ingress | Path-based routing via Nginx Ingress Controller |
| HPA | Auto-scaling for both frontend and backend |

---

## Security Implementation

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT tokens** with 7-day expiry for stateless auth
- All sensitive config stored in **environment variables**
- Kubernetes **Secrets** for credentials (base64 encoded)
- **Non-root user** inside Docker containers
- Input validation on all API endpoints with **express-validator**
- **CORS** configured for controlled cross-origin access
- `.gitignore` excludes all `.env` files and secrets

---

## How to Run

### Local Development (Docker Compose)
```bash
git clone https://github.com/Nitin-Sikarwar/Devops-app-notes.git
cd Devops-app-notes
docker-compose up --build -d
# Open http://localhost
```

### Production (Kubernetes)
```bash
kubectl apply -k kubernetes/base/
kubectl get all -n devops-notes
```

---

## Conclusion

The DevOps Notes Application successfully demonstrates a complete, production-grade software delivery pipeline. It covers the full spectrum of modern DevOps practices — from writing clean, maintainable application code to containerizing services, orchestrating them with Kubernetes, and automating the entire delivery process with GitHub Actions CI/CD.

This project serves as a practical reference implementation for anyone looking to understand how real-world applications are built, deployed, and maintained in a cloud-native environment.

---

*Project Repository: https://github.com/Nitin-Sikarwar/Devops-app-notes*
*Docker Hub: https://hub.docker.com/u/dock0ff*
