# Terraform apply

Run terraform apply. It's assumed that the repository contains in a bash script __terraform.sh__ that acts as a helper to pass to the commands the tfvars config files per environment.
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
- template: templates/terragrunt-apply/template.yaml@templates
  parameters:
    SUBSCRIPTION: "CSTAR-DEV-CONN"
    ENVIRONMENT: "dev"
```
