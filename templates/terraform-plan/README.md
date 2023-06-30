# Terraform plan

Run terraform init and terraform plan.

Is possible to do the plan even for AKS resources, to do that we use a Service Account with CA CRT and token that is used to generate the kubeconfig for terraform

## Pre-requisites

* Terraform must be installed
* It's assumed that the repository contains in a bash script `terraform.sh` that acts as a helper to pass to the commands the tfvars config files per environment.

for kubernetes plans:

* It's assumed that exists the cluster role and service account configuration to allow terraform/kubernetes to list all the resources
* It's assumed that service account jwt token and ca crt are saved into kv

## Pre-requisites for tf-summarize

* tf-summarize is installed. Use `- template: templates/terraform-summarize/template.yaml@terraform` to install it
* must be enable as flag

## Usage

```yaml
stages:
  - stage: DEV
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.DEV}}, true))
    pool:
      name: devopslab-dev-linux
    jobs:
      - job: tfplan_diego_common
        strategy:
          parallel: 1
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          - template: templates/terraform-summarize/template.yaml@terraform
          # 2. Run terraform plan diego-common
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "dev"
              WORKINGDIR: ${{ variables.WORKING_DIR_COMMON }}
              AZURE_SERVICE_CONNECTION_NAME: DEVOPSLAB-DEV-PLAN-SERVICE-CONN
      - job: tfplan_diego_app
        timeoutInMinutes: $[variables.TIME_OUT]
        strategy:
          parallel: 1
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          - template: templates/terraform-summarize/template.yaml@terraform
          # Run terraform plan diego-app
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              TF_ENVIRONMENT_FOLDER: "dev"
              TF_SUMMARIZE: true
              WORKINGDIR: ${{ variables.WORKING_DIR_APP }}
              AZURE_SERVICE_CONNECTION_NAME: DEVOPSLAB-DEV-PLAN-SERVICE-CONN
              AKS_NAME: ${{ variables.AKS_DEV_NAME }}
              AKS_API_SERVER_URL: ${{ variables.DEV01_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_TOKEN }}
```
