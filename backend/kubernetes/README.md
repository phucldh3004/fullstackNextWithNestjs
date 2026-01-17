# Kubernetes Deployment

Hướng dẫn deploy backend lên Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (GKE, EKS, AKS, hoặc local Minikube/Kind)
- `kubectl` CLI tool
- Docker image đã được push lên container registry

## Setup

### 1. Update Configuration

**deployment.yaml**:
- Đổi `your-dockerhub-username/nestjs-backend:latest` thành image của bạn
- Cập nhật secrets và configmap

**mongodb.yaml**:
- Cập nhật MongoDB password trong secrets
- Điều chỉnh storage size nếu cần

### 2. Create Secrets

```bash
# Tạo Docker registry secret (nếu dùng private registry)
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email

# Hoặc update secrets trong yaml files
```

### 3. Deploy MongoDB

```bash
# Deploy MongoDB
kubectl apply -f kubernetes/mongodb.yaml

# Kiểm tra MongoDB
kubectl get statefulset
kubectl get pods -l app=mongodb
kubectl logs -f mongodb-0
```

### 4. Deploy Backend

```bash
# Deploy backend application
kubectl apply -f kubernetes/deployment.yaml

# Kiểm tra deployment
kubectl get deployments
kubectl get pods -l app=nestjs-backend
kubectl get services
```

### 5. Verify Deployment

```bash
# Kiểm tra pods
kubectl get pods

# Xem logs
kubectl logs -f deployment/nestjs-backend

# Kiểm tra service
kubectl get svc nestjs-backend-service

# Test health endpoint
kubectl port-forward service/nestjs-backend-service 3001:80
curl http://localhost:3001/health
```

## Scaling

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment nestjs-backend --replicas=5

# Check replicas
kubectl get pods -l app=nestjs-backend
```

### Auto Scaling

HPA (Horizontal Pod Autoscaler) đã được cấu hình trong `deployment.yaml`:
- Min replicas: 2
- Max replicas: 10
- CPU threshold: 70%
- Memory threshold: 80%

```bash
# Kiểm tra HPA
kubectl get hpa

# Xem chi tiết
kubectl describe hpa nestjs-backend-hpa
```

## Updates & Rollouts

### Rolling Update

```bash
# Update image
kubectl set image deployment/nestjs-backend \
  nestjs-backend=your-username/nestjs-backend:v2.0.0

# Theo dõi rollout
kubectl rollout status deployment/nestjs-backend

# Xem history
kubectl rollout history deployment/nestjs-backend
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/nestjs-backend

# Rollback to specific revision
kubectl rollout undo deployment/nestjs-backend --to-revision=2
```

## Monitoring

### Logs

```bash
# Logs từ tất cả pods
kubectl logs -l app=nestjs-backend -f

# Logs từ specific pod
kubectl logs nestjs-backend-xxxxx -f

# Previous container logs
kubectl logs nestjs-backend-xxxxx --previous
```

### Events

```bash
# Xem events
kubectl get events --sort-by=.metadata.creationTimestamp

# Watch events
kubectl get events -w
```

### Resource Usage

```bash
# CPU and Memory usage
kubectl top nodes
kubectl top pods -l app=nestjs-backend
```

## Debugging

### Shell into Pod

```bash
# Exec into pod
kubectl exec -it nestjs-backend-xxxxx -- /bin/sh

# Run commands
kubectl exec nestjs-backend-xxxxx -- node -v
```

### Port Forwarding

```bash
# Forward local port to pod
kubectl port-forward nestjs-backend-xxxxx 3001:3001

# Forward to service
kubectl port-forward service/nestjs-backend-service 3001:80
```

### Describe Resources

```bash
# Describe pod
kubectl describe pod nestjs-backend-xxxxx

# Describe deployment
kubectl describe deployment nestjs-backend

# Describe service
kubectl describe service nestjs-backend-service
```

## Clean Up

```bash
# Delete all resources
kubectl delete -f kubernetes/deployment.yaml
kubectl delete -f kubernetes/mongodb.yaml

# Delete specific resources
kubectl delete deployment nestjs-backend
kubectl delete service nestjs-backend-service
kubectl delete statefulset mongodb
```

## Production Best Practices

1. **Secrets Management**:
   - Sử dụng external secrets management (AWS Secrets Manager, HashiCorp Vault)
   - Không commit secrets vào Git
   - Rotate secrets thường xuyên

2. **Resource Limits**:
   - Set appropriate CPU and memory limits
   - Monitor và adjust dựa trên usage

3. **Health Checks**:
   - Implement liveness và readiness probes
   - Set reasonable timeout và threshold values

4. **Persistent Storage**:
   - Use StatefulSets cho databases
   - Setup proper backup strategy
   - Consider managed database services

5. **Networking**:
   - Use Ingress cho external access
   - Setup proper network policies
   - Enable TLS/SSL

6. **Monitoring**:
   - Setup Prometheus + Grafana
   - Use logging aggregation (ELK, Loki)
   - Setup alerting

7. **CI/CD**:
   - Automate deployments với GitHub Actions/GitLab CI
   - Implement proper testing pipeline
   - Use GitOps (ArgoCD, Flux)

## Useful Commands Reference

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes

# All resources
kubectl get all -n default

# Resource usage
kubectl top nodes
kubectl top pods

# Logs
kubectl logs -f deployment/nestjs-backend
kubectl logs -f statefulset/mongodb

# Shell
kubectl exec -it nestjs-backend-xxxxx -- sh

# Port forward
kubectl port-forward svc/nestjs-backend-service 3001:80

# Scale
kubectl scale deployment nestjs-backend --replicas=5

# Rollout
kubectl rollout status deployment/nestjs-backend
kubectl rollout undo deployment/nestjs-backend

# Delete
kubectl delete -f kubernetes/
```

