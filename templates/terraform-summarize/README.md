# Install tf-summarize

Install tf-summarize in a debian-based linux agent. 

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v5.0.x

jobs:
  - template: templates/terraform-summarize/template.yaml@terraform

```
