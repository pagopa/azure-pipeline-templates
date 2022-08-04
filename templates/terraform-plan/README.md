# Terraform plan

Run terraform init and terraform plan.
It's assumed that the repository contains in a bash script `terraform.sh` that acts as a helper to pass to the commands the tfvars config files per environment.

You can find an example of the script in the following repository: [terraform.sh](https://github.com/pagopa/cstar-infrastructure/blob/main/src/terraform.sh)

## Prerequisites

- Terraform must be installed.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v17

jobs:
- template: templates/terraform-plan/template.yaml@terraform
  parameters:
    ENVIRONMENT: "dev"
    WORKINGDIR: 'src/core'
    AZURE_SERVICE_CONNECTION_NAME: "CSTAR-DEV-CONN"
```
