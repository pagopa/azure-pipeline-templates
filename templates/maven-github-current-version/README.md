# Maven Github current version template

Opinionated sequence of steps to get current version defined in `pom.xml` file.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: master

jobs:
  - template: templates/maven-github-current-version/template.yaml@templates
```
