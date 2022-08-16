# Terraform apply

Run terraform apply.

Is possible to do the plan even for AKS resources, to do that we use a Service Account with CA CRT and token that is used to generate the kubeconfig for terraform

## Pre-requisites

* Terraform must be installed
* It's assumed that the repository contains in a bash script `terraform.sh` that acts as a helper to pass to the commands the tfvars config files per environment.
* It's assumed that exists the cluster role and service account configuration to allow terraform/kubernetes to list all the resources

## Examples

You can find an example of the script in the following repository: [terraform.sh](https://github.com/pagopa/selfcare-infra/blob/main/src/core/terraform.sh)

## Usage

```yaml
resources:
  repositories:
    - repository: terraform
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/heads/main
      endpoint: 'io-azure-devops-github-ro'
```

```yaml
stages:
  - stage: DEV
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.DEV}}, true))
    pool:
      name: cstar-dev-linux
    jobs:
      #
      # idpay_common
      #
      - job: tf_apply_idpay_common
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform
          - template: templates/terraform-setup/template.yaml@terraform
          # 2. Run terraform plan
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              ENVIRONMENT: "dev"
              WORKINGDIR: 'src/domains/idpay-common'
              AZURE_SERVICE_CONNECTION_NAME: DEV-CSTAR-SERVICE-CONN
          # 3. Run terraform apply
          - template: templates/terraform-apply/template.yaml@terraform
            parameters:
              ENVIRONMENT: "dev"
              WORKINGDIR: 'src/domains/idpay-common'
              AZURE_SERVICE_CONNECTION_NAME: DEV-CSTAR-SERVICE-CONN
      #
      # idpay_app
      #
      - job: tf_apply_idpay_app
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - checkout: self
          # 1. Install terraform and terragrunt
          - template: templates/terraform-setup/template.yaml@terraform
          # 2. Run terraform plan
          - template: templates/terraform-plan/template.yaml@terraform
            parameters:
              ENVIRONMENT: "dev"
              WORKINGDIR: 'src/domains/idpay-app'
              AZURE_SERVICE_CONNECTION_NAME: DEV-CSTAR-SERVICE-CONN
              AKS_NAME: ${{ variables.AKS_DEV_NAME }}
              AKS_API_SERVER_URL: ${{ variables.DEV01_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_TOKEN }}
          # 3. Run terraform apply
          - template: templates/terraform-apply/template.yaml@terraform
            parameters:
              ENVIRONMENT: "dev"
              WORKINGDIR: 'src/domains/idpay-app'
              AZURE_SERVICE_CONNECTION_NAME: DEV-CSTAR-SERVICE-CONN
              AKS_NAME: ${{ variables.AKS_DEV_NAME }}
              AKS_API_SERVER_URL: ${{ variables.DEV01_AKS_APISERVER_URL }}
              AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_CACRT }}
              AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_TOKEN }}
```
