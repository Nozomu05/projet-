# Waifu Library — Déploiement DevOps Complet

Bibliothèque d'anime waifus avec pipeline CI/CD automatisé, conteneurisation Docker et orchestration Kubernetes.

---

## Architecture

```
┌─────────────────────────────────────┐
│     Frontend React (nginx)          │
│     Port 80  —  SPA + proxy /api/   │
└──────────────────┬──────────────────┘
                   │ /api/*  /health
┌──────────────────▼──────────────────┐
│     Backend Node.js + Express       │
│     Port 3000  —  REST API          │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│     PostgreSQL 16                   │
│     Port 5432  —  Base de données   │
└─────────────────────────────────────┘
```

---

## Lancement local (Docker Compose)

```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd waifu-library

# 2. Variables d'environnement
cp .env.example .env

# 3. Lancer tous les services
docker-compose up --build

# L'application est disponible sur http://localhost
# L'API est disponible sur  http://localhost:3000
# Health check :             http://localhost:3000/health
```

---

## Développement local (sans Docker)

```bash
# Backend
cd backend
npm install
cp .env.example .env   # adapter DB_HOST=localhost
npm run dev            # démarre sur :3000

# Frontend (autre terminal)
cd frontend
npm install
npm run dev            # démarre sur :5173
```

---

## API Endpoints

| Méthode | Endpoint                             | Description                     |
|---------|--------------------------------------|---------------------------------|
| GET     | `/health`                            | Health check                    |
| GET     | `/api/waifus`                        | Lister toutes les waifus        |
| GET     | `/api/waifus?search=rem`             | Recherche par nom / anime       |
| GET     | `/api/waifus?anime=Re:Zero`          | Filtrer par série                |
| GET     | `/api/waifus?hair_color=blue`        | Filtrer par couleur de cheveux  |
| GET     | `/api/waifus?sort=name&order=ASC`    | Trier                           |
| GET     | `/api/waifus/:id`                    | Détails d'une waifu             |
| POST    | `/api/waifus`                        | Ajouter une waifu               |

Corps POST :
```json
{
  "name": "Rem",
  "anime": "Re:Zero",
  "description": "...",
  "hair_color": "blue",
  "personality": "Dévouée, Courageuse",
  "rating": 9.8
}
```

---

## Pipeline CI/CD (GitHub Actions)

```
git push (branche main)
        ↓
1. Installation des dépendances  (npm install)
        ↓
2. Tests automatiques             (jest)  ← échec = pipeline arrêté
        ↓
3. Build des images Docker        (docker buildx)
        ↓
4. Push sur Docker Hub            (deux images : backend + frontend)
        ↓
5. Connexion SSH à la VM cloud
        ↓
6. Mise à jour Kubernetes         (kubectl set image + rollout status)
```

### Secrets GitHub requis

| Secret           | Description                          |
|------------------|--------------------------------------|
| `DOCKER_USERNAME`| Nom d'utilisateur Docker Hub         |
| `DOCKER_PASSWORD`| Token d'accès Docker Hub             |
| `VM_HOST`        | Adresse IP de la VM cloud            |
| `VM_USER`        | Utilisateur SSH (ex: `azureuser`)    |
| `VM_SSH_KEY`     | Clé privée SSH (contenu complet)     |

---

## Déploiement Kubernetes (sur la VM)

```bash
# Démarrer le cluster (Minikube)
minikube start

# Appliquer tous les manifests
kubectl apply -f k8s/

# Vérifier les pods
kubectl get pods -n waifu-library

# Accéder à l'application
minikube service frontend -n waifu-library
# OU via NodePort : http://<IP-VM>:30080
```

### Avant le premier déploiement K8s

Remplacer `DOCKER_USERNAME` dans les fichiers :
- [k8s/backend-deployment.yaml](k8s/backend-deployment.yaml)
- [k8s/frontend-deployment.yaml](k8s/frontend-deployment.yaml)

---

## Variables d'environnement

### Backend
| Variable      | Défaut      | Description                  |
|---------------|-------------|------------------------------|
| `PORT`        | `3000`      | Port d'écoute                |
| `DB_HOST`     | `localhost` | Hôte PostgreSQL              |
| `DB_PORT`     | `5432`      | Port PostgreSQL              |
| `DB_NAME`     | `waifudb`   | Nom de la base               |
| `DB_USER`     | `postgres`  | Utilisateur PostgreSQL       |
| `DB_PASSWORD` | `postgres`  | Mot de passe (à changer !)   |
| `CORS_ORIGIN` | `*`         | Origine CORS autorisée       |

### Frontend (build time)
| Variable        | Défaut | Description                          |
|-----------------|--------|--------------------------------------|
| `VITE_API_URL`  | ` `    | URL de l'API (vide = chemins relatifs)|

---

## Tests

```bash
cd backend
npm test             # avec couverture de code
npm run test:ci      # mode CI (GitHub Actions)
```

Les tests couvrent :
- `GET /health`
- `GET /api/waifus` (liste + filtres)
- `GET /api/waifus/:id` (trouvé / 404)
- `POST /api/waifus` (création / validation)

---

## Structure du projet

```
waifu-library/
├── .github/workflows/ci-cd.yml   # Pipeline CI/CD
├── backend/
│   ├── src/
│   │   ├── index.js              # Point d'entrée Express
│   │   ├── routes/waifus.js      # Routes REST
│   │   └── db/
│   │       ├── index.js          # Pool PostgreSQL + initDB
│   │       └── seed.js           # 20 waifus de départ
│   ├── tests/waifus.test.js      # Tests Jest
│   └── Dockerfile                # Multi-stage build
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, SearchBar, WaifuCard
│   │   ├── pages/                # Home, WaifuDetail
│   │   └── services/api.js       # Appels axios
│   ├── nginx.conf                # SPA + proxy /api/
│   └── Dockerfile                # Multi-stage : Vite → nginx
├── k8s/                          # Manifests Kubernetes
│   ├── namespace.yaml
│   ├── postgres-secret.yaml
│   ├── postgres-pvc.yaml
│   ├── postgres-deployment.yaml
│   ├── backend-deployment.yaml
│   └── frontend-deployment.yaml
├── docker-compose.yml
└── .env.example
```

---

## Difficultés rencontrées

1. **React Router + nginx** : toutes les routes `/waifu/:id` renvoient 404 sur nginx sans `try_files $uri $uri/ /index.html`.

2. **Race condition Docker Compose** : le backend démarrait avant que PostgreSQL soit prêt. Résolu avec `healthcheck` + `depends_on.condition: service_healthy`.

3. **Variables Vite au build-time** : `VITE_API_URL` est injecté lors du `npm run build`, pas à l'exécution. Solution : utiliser des chemins relatifs (`/api/`) et laisser nginx faire le proxy vers le backend.

4. **Secrets Kubernetes** : ne jamais committer de mots de passe en clair. Les `Secret` K8s sont encodés en base64 et référencés via `valueFrom.secretKeyRef`.
