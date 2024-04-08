# Postgres flexible failover

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
  - stage: ${{parameters.ENVIRONMENT}}_apply_${{parameters.FULL_DOMAIN_NAME}}
    displayName: 🚀 ${{parameters.ENVIRONMENT}}_apply_${{parameters.FULL_DOMAIN_NAME}}
    dependsOn: ['${{parameters.ENVIRONMENT}}_plan_${{parameters.FULL_DOMAIN_NAME}}']
    condition: succeeded()
    pool:
      name: ${{parameters.AZURE_DEVOPS_POOL_AGENT_NAME}}
    jobs:
      - deployment: ${{parameters.ENVIRONMENT}}_apply_${{parameters.FULL_DOMAIN_NAME}}
        continueOnError: false
        environment: ${{parameters.ENVIRONMENT}}
        strategy:
          runOnce:
            deploy:
              steps:
                - checkout: self
                # 1. Install terraform
                - template: ../terraform-setup/template.yaml@terraform
                # 2. Run terraform apply
                - template: ../terraform-apply/template.yaml@terraform
                  parameters:
                    WORKINGDIR: ${{parameters.WORKINGDIR}}
                    TF_ENVIRONMENT_FOLDER: ${{parameters.TF_ENVIRONMENT_FOLDER}}
                    AZURE_SERVICE_CONNECTION_NAME: ${{parameters.AZURE_SERVICE_CONNECTION_APPLY_NAME}}
                    AKS_NAME: ${{parameters.AKS_NAME}}
                    AKS_API_SERVER_URL: ${{parameters.AKS_API_SERVER_URL}}
                    AKS_AZURE_DEVOPS_SA_CA_CRT: ${{parameters.AKS_AZURE_DEVOPS_SA_CA_CRT}}
                    AKS_AZURE_DEVOPS_SA_TOKEN: ${{parameters.AKS_AZURE_DEVOPS_SA_TOKEN}}
```
