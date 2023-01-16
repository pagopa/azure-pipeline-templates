# sbt Github current version template

Opinionated sequence of steps to get current version defined in `version.sbt` file.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: master

jobs:
  - template: templates/sbt-github-current-version/template.yaml@templates
```
