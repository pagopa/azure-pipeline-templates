# Hekm microservice-chart setup

Ideally all the steps needed before deploy a helm microservice-chart

1. update `.version` and `.appVersion` in `helm/Chart.yaml` file using `DEPLOY_VERSION` parameter.
1. add helm repo microservice-chart
1. build helm

The first step is useful for pipeline that runs from a branch without a new release.
When a pipeline create a new release or runs from a release tag the values `.version` and `.appVersion` already contains `DEPLOY_VERSION` value.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v2.9.0

jobs:
  - template: templates/helm-microservice-chart-setup/template.yaml@templates
    parameters:
      DEPLOY_VERSION: $(deploy_version)
```

## Parameters

| param          | description                         | default |
| -------------- | ----------------------------------- | ------- |
| DEPLOY_VERSION | Current microservice deploy version |         |
