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
    displayName: 'Plan on DEV environment'
    type: boolean
    default: True
    values:
      - False
      - True
  - name: 'UAT'
    displayName: 'Plan on UAT environment'
    type: boolean
    default: True
    values:
      - False
      - True
  - name: 'PROD'
    displayName: 'Plan on PROD environment'
    type: boolean
    default: True
    values:
      - False
      - True

variables:
  TIME_OUT: 10

pool:
  vmImage: 'ubuntu-20.04'

resources:
  repositories:
    - repository: terraform
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/heads/DEVOPS-549-pipelines-fix-deploy-iac-la-richiesta-di-autorizzazione-non-e-piu-presente
      endpoint: 'io-azure-devops-github-ro'

lockBehavior: sequential
stages:
  - ${{ if eq(parameters['DEV'], true) }}:
    # DEV CORE
    - template: templates/terraform-plan-apply/template.yaml@terraform
      parameters:
        DOMAIN_NAME: 'core'
        AZURE_DEVOPS_POOL_AGENT_NAME: "pagopa-dev-linux"
        ENVIRONMENT: "dev"
        TF_ENVIRONMENT_FOLDER: "dev"
        WORKINGDIR: 'src/core'
        AZURE_SERVICE_CONNECTION_NAME: DEV-PAGOPA-SERVICE-CONN

  #
  # UAT
  #
  - ${{ if eq(parameters['UAT'], true) }}:
    # UAT CORE
    - template: templates/terraform-plan-apply/template.yaml@terraform
      parameters:
        DOMAIN_NAME: 'core'
        AZURE_DEVOPS_POOL_AGENT_NAME: "pagopa-uat-linux"
        ENVIRONMENT: "uat"
        TF_ENVIRONMENT_FOLDER: "uat"
        WORKINGDIR: 'src/core'
        AZURE_SERVICE_CONNECTION_NAME: UAT-PAGOPA-SERVICE-CONN

  #
  # PROD
  #
  - ${{ if eq(parameters['PROD'], true) }}:
    # PROD CORE
    - template: templates/terraform-plan-apply/template.yaml@terraform
      parameters:
        DOMAIN_NAME: 'core'
        AZURE_DEVOPS_POOL_AGENT_NAME: "pagopa-prod-linux"
        ENVIRONMENT: "prod"
        TF_ENVIRONMENT_FOLDER: "prod"
        WORKINGDIR: 'src/core'
        AZURE_SERVICE_CONNECTION_NAME: PROD-PAGOPA-SERVICE-CONN

```
