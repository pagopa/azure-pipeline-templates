# Node Github current version template

Opinionated sequence of steps to get current version defined in `package.json` file.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: master

jobs:
  - template: templates/node-github-current-version/template.yaml@templates
```
