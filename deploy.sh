$SHA
# export SHA=$"git rev-parse HEAD"
$SHA

# docker build -t surajsingla333/complex-client:$SHA -f ./client/Dockerfile ./client
docker build -t surajsingla333/complex-client:latest -t surajsingla333/complex-client:$SHA -f ./client/Dockerfile ./client
# docker build -t surajsingla333/complex-server-kubernetes:$SHA -f ./server/Dockerfile ./server
docker build -t surajsingla333/complex-server-kubernetes:latest -t surajsingla333/complex-server-kubernetes:$SHA -f ./server/Dockerfile ./server
# docker build -t surajsingla333/complex-worker:$SHA -f ./worker/Dockerfile ./worker
docker build -t surajsingla333/complex-worker:latest -t surajsingla333/complex-worker:$SHA -f ./worker/Dockerfile ./worker

docker push surajsingla333/complex-client:latest
docker push surajsingla333/complex-server-kubernetes:latest
docker push surajsingla333/complex-worker:latest

docker push surajsingla333/complex-client:$SHA
docker push surajsingla333/complex-server-kubernetes:$SHA
docker push surajsingla333/complex-worker:$SHA

# kubectl apply -f k8s
# kubectl set image deployments/server-deployment server=surajsingla333/complex-server-kubernetes:$SHA
# kubectl set image deployments/client-deployment server=surajsingla333/complex-client:$SHA
# kubectl set image deployments/worker-deployment server=surajsingla333/complex-worker:$SHA