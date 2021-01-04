# Install terraform and terragrunt

Install terraform and terragrunt in a debian besed linux vm.

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
```
