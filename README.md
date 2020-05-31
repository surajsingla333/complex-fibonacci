# complex-fibonacci

Run on kubernetes do the following steps:

1) create pg secret:
  // creating secret
  > kubectl create {type of object} {type of secret} {secret_name} --from-literal {key-value pair of the secret info {key=value}}
  >> kubectl create secret generic(/docker-registry/tls(for http)) pgpassword --from-literal PGPASSWORD=pg_password
 
 2) run ingres-nginx:
  > kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/cloud/deploy.yaml
