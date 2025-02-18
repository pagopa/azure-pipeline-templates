# Helm microservice-chart deploy from tree structure

Deploy helm microservice chart with release annotations in application insights

In particular, it:
- reads namespace and image tag from values file
- executes helm template to output the "plan"
- executes helm upgrade to deploy the given char

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/<tag>

stages:
  - template: templates/helm-microservice-chart-deploy-tree/template.yaml@templates
    parameters:
      DO_DEPLOY: true
      ENV: ${{ parameters.ENV }}
      KUBERNETES_SERVICE_CONN: $(DEV_KUBERNETES_SERVICE_CONN)
      APP_NAME: ${{ parameters.APP_NAME }}
      CHART_PATH: "helm/${{parameters.ENV}}/${{parameters.APP_NAME}}"
      VALUE_FILE: "helm/${{parameters.ENV}}/${{parameters.APP_NAME}}/values.yaml"
```


### APPINSIGHTS_SERVICE_CONN

Allow to put a log into app insight to understand when a deploy is done. If `APPINSIGHTS_SERVICE_CONN` is null no operations are executed
