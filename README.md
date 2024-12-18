# Node.js Express MySQL Application

Bu proje, Node.js, Express ve MySQL kullanarak oluşturulmuş bir REST API uygulamasıdır.

## Proje Yapısı

```
.
├── app/
│   ├── routes/
│   │   └── users.js
│   └── config/
├── helm/
│   ├── templates/
│   ├── values.yaml
│   ├── values-staging.yaml
│   └── values-production.yaml
├── k8s/
│   ├── external-secrets.yaml
│   └── argocd-app.yaml
├── server.js
├── Dockerfile
└── .gitlab-ci.yml
```

## Kurulum

### Ön Gereksinimler

- Node.js
- Docker
- Kubernetes Cluster
- Helm
- ArgoCD
- External Secrets Operator

### Geliştirme Ortamı

1. Repo'yu klonlayın:
```bash
git clone https://gitlab.com/yourusername/nodejs-express-mysql.git
cd nodejs-express-mysql
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme ortamında çalıştırın:
```bash
npm run dev
```

### Kubernetes Deployment

1. External Secrets Operator'ü kurun:
```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace
```

2. Secret Store'u yapılandırın:
```bash
kubectl apply -f k8s/external-secrets.yaml
```

3. ArgoCD'yi kurun:
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

4. ArgoCD uygulamasını deploy edin:
```bash
kubectl apply -f k8s/argocd-app.yaml
```

## CI/CD Pipeline

Proje GitLab CI/CD kullanmaktadır. Pipeline aşamaları:

1. Build: Docker image'ı oluşturur ve registry'ye push eder
2. Deploy Staging: Staging ortamına deploy eder
3. Deploy Production: Production ortamına manuel onay ile deploy eder

## Environments

- Staging: staging-api.yourdomain.com
- Production: api.yourdomain.com

## API Endpoints

- GET /users - Tüm kullanıcıları listeler
- GET /users/:id - Belirli bir kullanıcıyı getirir
- POST /users - Yeni kullanıcı oluşturur
- PUT /users/:id - Kullanıcı bilgilerini günceller
- DELETE /users/:id - Kullanıcı siler