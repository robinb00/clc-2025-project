## What has happened so far?
### Microservices
- Services contain minimal routing,
we will have to extend this a little so we can showcase functionality.
But not too much – the inventory service, for example, does only track the number of items in stock.

### Docker, Build and Package Registry
- Each service has its Dockerfile
- Each Commit on main will trigger a **workflow** that builds and publishes the Docker image to the [GitHub Package Registry](https://github.com/robinb00?tab=packages&repo_name=clc-2025-project)

### Kubernetes
- The Kubernetes cluster is defined in the `k8s` folder
- it takes automatically the latest Docker image from the GitHub Package Registry (the GitHub Actions workflow overrides
the image tag in the `kustomization.yaml` with the latest commit SHA)
- The cluster can only be deployed manually using kind (no real cloud provider yet)
  
```bash
# create cluster
kind create cluster --name storage-system
# change context
kubectl config use-context kind-storage-system
# create namespace
kubectl apply -f k8s/namespace.yaml
# create GitHub authentification secret to access the registry (replace GitHub credentials)
kubectl create secret docker-registry ghcr-credentials --docker-server=ghcr.io --docker-username=<GitHub-username> --docker-password=<PAT> --docker-email=<e-mail> -n storage-system
# deploy cluster
kubectl apply -k k8s/overlays/dev
# check if pods were deployed successfully
kubectl get pods -n storage-system
# Optional: Forward prometheus port to localhost
kubectl port-forward svc/prometheus -n storage-system 9090:9090
```

### Monitoring
- Prometheus is deployed in the cluster. It is not really configured yet, but it is able to find the services using
dynamic service discovery and should be able to scrape metrics from them.
- Grafana is deployed in the cluster

### Questions and TODOs
- What functionality should the services have?
- We need a (web)UI in front of the api-gateway to showcase the functionality
- May some component that creates traffic (like the UI, but a lot more traffic)
- Create Visualizations in Grafana?
- Deploy a cluster to a real cloud provider? Maybe on TAG creation events? I have no Google Trial Credits left