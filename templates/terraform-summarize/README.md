# Install tf-summarize

Install tf-summarize in a debian-based linux agent. Using Tar Gz

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v5.2.x

jobs:
  - template: templates/terraform-summarize/template.yaml@terraform

```
