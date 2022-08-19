# Hekm microservice-chart deploy

Deploy helm miceoservice chart with release annotations in application insights

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v2.10.0

- stage: "Deploy"
  dependsOn: "Build"
  variables:
    deploy_version: $[ stageDependencies.Build.build.outputs['deploy_version_decision.value'] ]
  jobs:
    - deployment: "deploy"
      pool:
        name: io-prod-linux
      environment: PROD
      strategy:
        runOnce:
          deploy:
            steps:
              - checkout: self
                displayName: "Checkout"
              - template: templates/helm-microservice-chart-setup/template.yaml@templates
                parameters:
                  DEPLOY_VERSION: $(deploy_version)
              - template: templates/helm-microservice-chart-deploy/template.yaml@templates
                parameters:
                  DO_DEPLOY: ${{ parameters.ENVIRONMENT_WEU_BETA }}
                  ENV: BETA
                  KUBERNETES_SERVICE_CONN: ${{ variables.KUBERNETES_SERVICE_CONN_WEU_BETA }}
                  NAMESPACE: $(NAMESPACE)
                  APP_NAME: $(DOCKER_IMAGE_NAME)
                  VALUE_FILE: "helm/values-beta.yaml"
                  DEPLOY_VERSION: $(deploy_version)
                  APPINSIGHTS_SERVICE_CONN: ${{ variables.APPINSIGHTS_SERVICE_CONN_PROD }}
                  APPINSIGHTS_RESOURCE_ID: ${{ variables.APPINSIGHTS_RESOURCE_ID_PROD }}
```

## Parameters

TODO
