# Terraform AWS plan

Run terraform apply
It's assumed that the repository contains in a bash script `terraform.sh` that acts as a helper to pass to the commands the tfvars config files per environment.

You can find an example of the script in the following repository: [terraform.sh](https://github.com/pagopa/pagopa.gov.it-infrastructure/blob/main/src/main/terraform.sh)

## Prerequisites

- Terraform must be installed.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v20

jobs:
- template: templates/terraform-aws-apply/template.yaml@terraform
  parameters:
    CONNECTION: "AWS Pro"
    ENVIRONMENT: "prod"
    WORKINGDIR: 'src/core'
    AWS_REGION: 'eu-south-1'
```
