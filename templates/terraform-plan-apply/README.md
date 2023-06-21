# Terraform plan-apply

Run terraform apply (and plan before).

Is possible to do the plan even for AKS resources, to do that we use a Service Account with CA CRT and token that is used to generate the kubeconfig for terraform

## Pre-requisites

* Terraform must be installed
* It's assumed that the repository contains in a bash script `terraform.sh` that acts as a helper to pass to the commands the tfvars config files per environment.
* It's assumed that exists the cluster role and service account configuration to allow terraform/kubernetes to list all the resources

## Examples

You can find an example of the script in the following repository: [terraform.sh](https://github.com/pagopa/selfcare-infra/blob/main/src/core/terraform.sh)

## Usage

```yaml
# only manual
trigger: none
pr: none

parameters:
  - name: 'DEV'
    displayName: 'Run on DEV environment'
    type: boolean
    default: True
    values:
      - False
      - True


variables:
  TIME_OUT: 10
  #dev
  DEV01_AKS_APISERVER_URL: '$(TF_DEV01_AKS_APISERVER_URL)'
  DEV01_AKS_AZURE_DEVOPS_SA_CACRT: '$(TF_DEV01_AKS_AZURE_DEVOPS_SA_CACRT)'
  DEV01_AKS_AZURE_DEVOPS_SA_TOKEN: '$(TF_DEV01_AKS_AZURE_DEVOPS_SA_TOKEN)'
  AKS_DEV_NAME: '$(TF_AKS_DEV_NAME)'
  # working dir
  WORKING_DIR_COMMON: 'src/domains/rtd-common'
  WORKING_DIR_APP: 'src/domains/rtd-app'
  DOMAIN_NAME: rtd

pool:
  vmImage: 'ubuntu-latest'

resources:
  repositories:
    - repository: terraform
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/heads/apply-with-output-state
      endpoint: 'io-azure-devops-github-ro'

stages:
#DEV
  - ${{ if eq(parameters['DEV'], true) }}:
    - template: templates/terraform-plan-apply/template.yaml@terraform
      parameters:
        FULL_DOMAIN_NAME: "${{variables.DOMAIN_NAME}}_common"
        TF_ENVIRONMENT_FOLDER: "dev"
        ENVIRONMENT: "DIEGO_ENV"
        AZURE_DEVOPS_POOL_AGENT_NAME: "cstar-dev-linux-infra"
        WORKINGDIR: ${{ variables.WORKING_DIR_COMMON }}
        AZURE_SERVICE_CONNECTION_PLAN_NAME: CSTAR-DEV-PLAN-SERVICE-CONN
        AZURE_SERVICE_CONNECTION_APPLY_NAME: DEV-CSTAR-SERVICE-CONN
    - template: templates/terraform-plan-apply/template.yaml@terraform
      parameters:
        FULL_DOMAIN_NAME: "${{variables.DOMAIN_NAME}}_app"
        TF_ENVIRONMENT_FOLDER: "dev"
        ENVIRONMENT: "DIEGO_ENV"
        AZURE_DEVOPS_POOL_AGENT_NAME: "cstar-dev-linux-infra"
        WORKINGDIR:  ${{ variables.WORKING_DIR_APP }}
        AKS_NAME: ${{ variables.AKS_DEV_NAME }}
        AKS_API_SERVER_URL: ${{ variables.DEV01_AKS_APISERVER_URL }}
        AKS_AZURE_DEVOPS_SA_CA_CRT: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_CACRT }}
        AKS_AZURE_DEVOPS_SA_TOKEN: ${{ variables.DEV01_AKS_AZURE_DEVOPS_SA_TOKEN }}
        AZURE_SERVICE_CONNECTION_PLAN_NAME: CSTAR-DEV-PLAN-SERVICE-CONN
        AZURE_SERVICE_CONNECTION_APPLY_NAME: DEV-CSTAR-SERVICE-CONN

```
