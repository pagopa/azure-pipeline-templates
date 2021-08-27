# Install terraform

Install terraform in a debian-based linux agent. This is intended as a setup step in order to run terraform script in subsequent tasks of the same job.

## Prerequisites

The repository aming to use this template within a `azure pipeline` must have in its root the following hidden file:

* .terraform-version

the file should present a valid terraform version used for builing the infrastructure.

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
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v16

jobs:
- template: templates/terraform-setup/template.yaml@templates
- script:|
    terraform -version
   displayName: 'here you can execute any terraform command'
```
