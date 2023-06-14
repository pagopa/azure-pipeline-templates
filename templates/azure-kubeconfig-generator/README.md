# Azure kubeconfig generator

Allow to generate kubeconfig for azure, and allow terraform or helm to connecto to the cluster

## Pre-requisites

* kubelogin must be installed

for kubernetes plans:

* It's assumed that service account jwt token and ca crt are saved into kv

## Usage

```yaml
steps:
  - template: ../azure-kubeconfig-generator/template.yaml
    parameters:
      AZURE_SERVICE_CONNECTION_NAME: '${{ parameters.AZURE_SERVICE_CONNECTION_NAME }}'
      WORKINGDIR: '${{ parameters.WORKINGDIR }}'
      AKS_NAME: '${{ parameters.AKS_NAME }}'
      AKS_API_SERVER_URL: '${{ parameters.AKS_API_SERVER_URL }}'
      AKS_AZURE_DEVOPS_SA_CA_CRT: '${{ parameters.AKS_AZURE_DEVOPS_SA_CA_CRT }}'
      AKS_AZURE_DEVOPS_SA_TOKEN: '${{ parameters.AKS_AZURE_DEVOPS_SA_TOKEN }}'
```
