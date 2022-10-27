# Terraform plan

Run terraform init and terraform plan.

Is possible to do the plan even for AKS resources, to do that we use a Service Account with CA CRT and token that is used to generate the kubeconfig for terraform

## Pre-requisites

* Terraform must be installed
* It's assumed that the repository contains in a bash script `terraform.sh` that acts as a helper to pass to the commands the tfvars config files per environment.

for kubernetes plans:

* It's assumed that exists the cluster role and service account configuration to allow terraform/kubernetes to list all the resources
* It's assumed that service account jwt token and ca crt are saved into kv

## Usage

```yaml
pr:
  autoCancel: false
  branches:
    include:
      - main
  paths:
    include:
      - 'src/domains/shared-app'
      - 'src/domains/shared-common'
    exclude:
      - '**/*.lock.hcl'

parameters:
  - name: 'DEV'
    displayName: 'Run on DEV environment'
    type: boolean
    default: True
    values:
      - False
      - True
  - name: 'UAT'
    displayName: 'Run on UAT environment'
    type: boolean
    default: True
    values:
      - False
      - True
  - name: 'PROD'
    displayName: 'Run on PROD environment'
    type: boolean
    default: True
    values:
      - False
      - True

variables:
  TIME_OUT: 15
  DEV_AKS_APISERVER_URL: '$(TF_DEV_AKS_APISERVER_URL)'
  DEV_AKS_AZURE_DEVOPS_SA_CACRT: '$(TF_DEV_AKS_AZURE_DEVOPS_SA_CACRT)'
  DEV_AKS_AZURE_DEVOPS_SA_TOKEN: '$(TF_DEV_AKS_AZURE_DEVOPS_SA_TOKEN)'
  AKS_DEV_NAME: '$(TF_AKS_DEV_NAME)'
  DEV_AZURE_SERVICE_CONNECTION: '$(TF_DEV_AZURE_SERVICE_CONNECTION)'

  UAT_AKS_APISERVER_URL: '$(TF_UAT_AKS_APISERVER_URL)'
  UAT_AKS_AZURE_DEVOPS_SA_CACRT: '$(TF_UAT_AKS_AZURE_DEVOPS_SA_CACRT)'
  UAT_AKS_AZURE_DEVOPS_SA_TOKEN: '$(TF_UAT_AKS_AZURE_DEVOPS_SA_TOKEN)'
  AKS_UAT_NAME: '$(TF_AKS_UAT_NAME)'
  UAT_AZURE_SERVICE_CONNECTION: '$(TF_UAT_AZURE_SERVICE_CONNECTION)'

  PROD_AKS_APISERVER_URL: '$(TF_PROD_AKS_APISERVER_URL)'
  PROD_AKS_AZURE_DEVOPS_SA_CACRT: '$(TF_PROD_AKS_AZURE_DEVOPS_SA_CACRT)'
  PROD_AKS_AZURE_DEVOPS_SA_TOKEN: '$(TF_PROD_AKS_AZURE_DEVOPS_SA_TOKEN)'
  AKS_PROD_NAME: '$(TF_AKS_PROD_NAME)'
  PROD_AZURE_SERVICE_CONNECTION: '$(TF_PROD_AZURE_SERVICE_CONNECTION)'

pool:
  vmImage: 'ubuntu-20.04'

resources:
  repositories:
    - repository: terraform
      type: github
      name: pagopa/azure-pipeline-templates
      # ref: refs/tags/v2.10.3
      ref: refs/heads/DEVOPS-549-pipelines-fix-deploy-iac-la-richiesta-di-autorizzazione-non-e-piu-presente
      endpoint: 'io-azure-devops-github-ro'

stages:
  - stage: DEV
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.DEV}}, true))
    pool:
      name: "pagopa-dev-linux"
    jobs:
      - job: tfplan_shared_common
        strategy:
          parallel: 1
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # 2. Run terraform plan shared-common
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "weu-dev"
              WORKINGDIR: 'src/domains/shared-common'
              AZURE_SERVICE_CONNECTION_NAME: ${{ variables.DEV_AZURE_SERVICE_CONNECTION }}
      - job: tfplan_shared_app
        timeoutInMinutes: $[variables.TIME_OUT]
        strategy:
          parallel: 1
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # Run terraform plan shared-app
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "weu-dev"
              WORKINGDIR: 'src/domains/shared-app'
              AZURE_SERVICE_CONNECTION_NAME: ${{ variables.DEV_AZURE_SERVICE_CONNECTION }}
              AKS_NAME: ${{ variables.AKS_DEV_NAME }}
              AKS_API_SERVER_URL: ${{ variables.DEV_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.DEV_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.DEV_AKS_AZURE_DEVOPS_SA_TOKEN }}

#
# UAT
#
  - stage: UAT
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.UAT}}, true))
    pool:
      name: "pagopa-uat-linux"
    jobs:
      - job: tfplan_shared_common
        strategy:
          parallel: 1
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # 2. Run terraform plan shared-common
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "weu-uat"
              WORKINGDIR: 'src/domains/shared-common'
              AZURE_SERVICE_CONNECTION_NAME: ${{ variables.UAT_AZURE_SERVICE_CONNECTION }}
      - job: tfplan_shared_app
        timeoutInMinutes: $[variables.TIME_OUT]
        strategy:
          parallel: 1
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # Run terraform plan shared-app
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "weu-uat"
              WORKINGDIR: 'src/domains/shared-app'
              AZURE_SERVICE_CONNECTION_NAME: ${{ variables.UAT_AZURE_SERVICE_CONNECTION }}
              AKS_NAME: ${{ variables.AKS_UAT_NAME }}
              AKS_API_SERVER_URL: ${{ variables.UAT_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.UAT_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.UAT_AKS_AZURE_DEVOPS_SA_TOKEN }}

#
# PROD
#
  - stage: PROD
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.PROD}}, true))
    pool:
      name: "pagopa-prod-linux"
    jobs:
      - job: tfplan_shared_common
        strategy:
          parallel: 1
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # 2. Run terraform plan shared-common
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "weu-prod"
              WORKINGDIR: 'src/domains/shared-common'
              AZURE_SERVICE_CONNECTION_NAME: ${{ variables.PROD_AZURE_SERVICE_CONNECTION }}
      - job: tfplan_shared_app
        timeoutInMinutes: $[variables.TIME_OUT]
        strategy:
          parallel: 1
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # Run terraform plan shared-app
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "weu-prod"
              WORKINGDIR: 'src/domains/shared-app'
              AZURE_SERVICE_CONNECTION_NAME: ${{ variables.PROD_AZURE_SERVICE_CONNECTION }}
              AKS_NAME: ${{ variables.AKS_PROD_NAME }}
              AKS_API_SERVER_URL: ${{ variables.PROD_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.PROD_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.PROD_AKS_AZURE_DEVOPS_SA_TOKEN }}

```
