# Docker Github Release template

Opinionated sequence of steps to build and push a docker image into a registry

1. login to docker container registry
1. if `FORCE_REPLACE_DOCKER_IMAGE` is false and docker image with `DOCKER_IMAGE_TAG` not exists, build and push the image into the registry
1. if `FORCE_REPLACE_DOCKER_IMAGE` is true, build and push the image into the registry

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: refs/tags/v1

jobs:
  - template: templates/docker-release/template.yaml@templates
    parameters:
      CONTAINER_REGISTRY_SERVICE_CONN: $(CONTAINER_REGISTRY_SERVICE_CONN)
      CONTAINER_REGISTRY_FQDN: $(CONTAINER_REGISTRY_FQDN)
      DOCKER_IMAGE_NAME: $(DOCKER_IMAGE_NAME)
      DOCKER_IMAGE_TAG: $(deploy_version_decision.value)
      FORCE_REPLACE_DOCKER_IMAGE: ${{ parameters.FORCE_REPLACE_DOCKER_IMAGE }}
```

## Parameters

| param                           | description                                    | default |
| ------------------------------- | ---------------------------------------------- | ------- |
| CONTAINER_REGISTRY_SERVICE_CONN | Container registry service connection name     |         |
| CONTAINER_REGISTRY_FQDN         | Container registry FQDN                        |         |
| DOCKER_IMAGE_NAME               | Docker image name                              |         |
| DOCKER_IMAGE_TAG                | Docker image tag                               |         |
| FORCE_REPLACE_DOCKER_IMAGE      | Parameter to replace an existing the image tag |         |
