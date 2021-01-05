# Install terraform and terragrunt

Install terraform and terragrunt in a debian-based linux agent. This is intended as a setup step in order to run terraform/terragrunt script in subsequent tasks of the same job.

## Prerequisites

The repository aming to use this template within a `azure pipeline` must have in its root the following hidden files:

* .terraform-version
* .terragrunt-version

both files should present a valid terraform version and terragrunt verison used for builing the infrastructure.

eg:

_.terraform-version_
```
0.13.3
```

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: refs/tags/v5

jobs:
- template: templates/terraform-setup/template.yaml@templates
- script:|
    terraform -version && terragrunt -version 
   displayName: 'here you can execute any terraform/terragrunt command'
```
