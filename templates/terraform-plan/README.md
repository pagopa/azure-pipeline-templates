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
      - 'src/domains/rtd-app'
      - 'src/domains/rtd-common'
    exclude:
      - '**/*.lock.hcl'
      - '**/*.md'

parameters:
  - name: 'DEV'
    displayName: 'Run on DEV environment'
    type: boolean
    default: True
    values:
      - False
      - True


variables:
  TIME_OUT: 15
  #dev
  DEV01_AKS_APISERVER_URL: '$(TF_DEV01_AKS_APISERVER_URL)'
  DEV01_AKS_AZURE_DEVOPS_SA_CACRT: '$(TF_DEV01_AKS_AZURE_DEVOPS_SA_CACRT)'
  DEV01_AKS_AZURE_DEVOPS_SA_TOKEN: '$(TF_DEV01_AKS_AZURE_DEVOPS_SA_TOKEN)'
  AKS_DEV_NAME: '$(TF_AKS_DEV_NAME)'
  # working dir
  WORKING_DIR_COMMON: 'src/domains/rtd-common'
  WORKING_DIR_APP: 'src/domains/rtd-app'

pool:
  vmImage: 'ubuntu-latest'

resources:
  repositories:
    - repository: terraform
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v4.0.0
      endpoint: 'io-azure-devops-github-ro'

stages:
  - stage: DEV
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.DEV}}, true))
    pool:
      name: cstar-dev-linux-infra
    jobs:
      - job: tf_plan_rtd_common
        strategy:
          parallel: 1
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # 2. Run terraform plan rtd-common
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "dev"
              WORKINGDIR: ${{ variables.WORKING_DIR_COMMON }}
              AZURE_SERVICE_CONNECTION_NAME: CSTAR-DEV-PLAN-SERVICE-CONN
      - job: tf_plan_rtd_app
        timeoutInMinutes: $[variables.TIME_OUT]
        strategy:
          parallel: 1
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # Run terraform plan rtd-app
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "dev"
              WORKINGDIR: ${{ variables.WORKING_DIR_APP }}
              AZURE_SERVICE_CONNECTION_NAME: CSTAR-DEV-PLAN-SERVICE-CONN
              AKS_NAME: ${{ variables.AKS_DEV_NAME }}
              AKS_API_SERVER_URL: ${{ variables.DEV01_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_TOKEN }}
```
