#!/usr/bin/env bash
set -e

#
# This script allow to generate a kubeconfig file, as done by the pipeline plan and apply
#

AKS_NAME=$1
AKS_API_SERVER_URL=$2
AKS_AZURE_DEVOPS_SA_CA_CRT=$3
AKS_AZURE_DEVOPS_SA_TOKEN=$4


echo "$AKS_AZURE_DEVOPS_SA_CA_CRT"| base64 --decode > cacrt

echo "[INFO] kubectl set-cluster"
kubectl config set-cluster aks-azure-devops \
  --certificate-authority=cacrt \
  --embed-certs=true \
  --server=$AKS_API_SERVER_URL \
  --kubeconfig="config-$AKS_NAME"

echo "[INFO] kubectl set-credentials"
kubectl config set-credentials azure-devops \
  --token=$AKS_AZURE_DEVOPS_SA_TOKEN \
  --kubeconfig="config-$AKS_NAME"

echo "[INFO] kubectl set-context"
kubectl config set-context iac \
  --cluster=aks-azure-devops \
  --user=azure-devops \
  --kubeconfig="config-$AKS_NAME"
