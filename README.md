# DevOps Notes Application

A production-grade full-stack notes application with complete DevOps implementation.

**Stack:** React.js | Node.js + Express | MySQL | Docker | Kubernetes | GitHub Actions

---

## Project Structure

```
devops-notes-app/
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Navbar, NoteCard, NoteModal, etc.
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── pages/          # Login, Register, Dashboard
│   │   └── services/       # Axios API service
│   ├── nginx.conf          # Nginx config with API proxy
│   └── Dockerfile          # Multi-stage build
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database, Logger
│   │   ├── controllers/    # Auth, Notes
│   │   ├── middleware/     # Auth, Logger, ErrorHandler
│   │   ├── models/         # User, Note (Sequelize)
│   │   └── routes/         # Auth, Notes routes
│   └── Dockerfile          # Multi-stage build
├── kubernetes/base/        # K8s manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── mysql.yaml
│   ├── backend.yaml
│   ├── frontend.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
├── mysql/                  # DB init scripts
├── .github/workflows/      # GitHub Actions CI/CD
├── docker-compose.yml
└── .gitignore
```

---

## Quick Start (Local Development)

### Prerequisites
- Docker Desktop installed and running
- Node.js 20+ (for local dev without Docker)

### Run with Docker Compose (Recommended)

```cmd
cd devops-notes-app

REM Copy environment file
copy backend\.env.example backend\.env

REM Start all services
docker-compose up --build -d

REM Check status
docker-compose ps

REM View logs
docker-compose logs -f

REM Stop all services
docker-compose down
```

App runs at: http://localhost:80
Backend API: http://localhost:5000
MySQL: localhost:3306

---

## Local Development (Without Docker)

### Backend Setup

```cmd
cd devops-notes-app\backend

REM Install dependencies
npm install

REM Copy and configure environment
copy .env.example .env

REM Start development server
npm run dev
```

### Frontend Setup

```cmd
cd devops-notes-app\frontend

REM Install dependencies
npm install

REM Copy and configure environment
copy .env.example .env

REM Start development server
npm start
```

---

## Docker Commands

```cmd
REM Build backend image
docker build -t devops-notes-backend:latest ./backend

REM Build frontend image
docker build -t devops-notes-frontend:latest ./frontend

REM Run backend container
docker run -d -p 5000:5000 --env-file backend/.env devops-notes-backend:latest

REM Run frontend container
docker run -d -p 80:80 devops-notes-frontend:latest

REM View running containers
docker ps

REM View container logs
docker logs notes-backend -f
docker logs notes-frontend -f

REM Stop and remove containers
docker-compose down -v

REM Remove all images
docker rmi devops-notes-backend devops-notes-frontend
```

---

## Kubernetes Deployment

### Prerequisites
- kubectl configured with cluster access
- Nginx Ingress Controller installed
- Metrics Server installed (for HPA)

### Setup Secrets

```cmd
REM Encode your values to base64 (PowerShell)
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your_jwt_secret"))

REM Update kubernetes\base\secrets.yaml with encoded values
```

### Deploy to Kubernetes

```cmd
REM Update image names in kubernetes/base/backend.yaml and frontend.yaml
REM Replace YOUR_DOCKERHUB_USERNAME with your actual Docker Hub username

REM Apply all manifests
kubectl apply -k kubernetes/base/

REM Check deployment status
kubectl get all -n devops-notes

REM Watch pods
kubectl get pods -n devops-notes -w

REM Check logs
kubectl logs -l app=backend -n devops-notes -f
kubectl logs -l app=frontend -n devops-notes -f

REM Scale deployments manually
kubectl scale deployment backend --replicas=3 -n devops-notes
kubectl scale deployment frontend --replicas=3 -n devops-notes

REM Rolling update (after pushing new image)
kubectl rollout restart deployment/backend -n devops-notes
kubectl rollout restart deployment/frontend -n devops-notes

REM Check rollout status
kubectl rollout status deployment/backend -n devops-notes

REM Rollback if needed
kubectl rollout undo deployment/backend -n devops-notes

REM Delete all resources
kubectl delete namespace devops-notes
```

### Install Nginx Ingress Controller

```cmd
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

### Install Metrics Server (for HPA)

```cmd
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

## CI/CD Setup (GitHub Actions)

### Required GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `KUBE_CONFIG` | Base64 encoded kubeconfig file |

### Encode kubeconfig

```cmd
REM PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\.kube\config"))
```

### Pipeline Flow

```
git push → main branch
    ↓
Test Backend (Node.js syntax check)
Test Frontend (React build)
    ↓
Build Docker Images (multi-stage)
Push to Docker Hub (latest + SHA tag)
    ↓
Update K8s manifests with new image tag
kubectl apply -k kubernetes/base/
    ↓
Wait for rollout completion
Verify deployment status
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Notes (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | Get all notes (supports ?search=&page=&limit=) |
| GET | /api/notes/:id | Get single note |
| POST | /api/notes | Create note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Liveness check |
| GET | /ready | Readiness check (DB connection) |

---

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_NAME | Database name | devops_notes |
| DB_USER | DB username | notesuser |
| DB_PASSWORD | DB password | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiry | 7d |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | /api |

---

## Troubleshooting

```cmd
REM Backend can't connect to MySQL
docker-compose logs mysql
docker-compose restart backend

REM Frontend shows blank page
docker-compose logs frontend
docker exec -it notes-frontend nginx -t

REM Kubernetes pod not starting
kubectl describe pod <pod-name> -n devops-notes
kubectl logs <pod-name> -n devops-notes

REM HPA not scaling
kubectl describe hpa -n devops-notes
kubectl top pods -n devops-notes
```
