# Rest Healthcheck template

Perform HTTP requests to a given endpoint of the app being processed. It is intended to be used as a check before promoting a slot into production.
Requests are made inside a container which needs to be mounted using specific networking configurations and grants.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: refs/tags/v1

jobs:
  - template: templates/rest-healthcheck/template.yaml@templates
    parameters:
      azureSubscription: mySubscription
      appName: myAppname
      endpoint: 'https://myAppname.azurewebsites.net/my-endpoint'
      endpointType: 'private' #or public
      headers: 'KEY1=$(MY-VALUE) KEY2=$(MY-SECRET)'
      containerInstanceResourceGroup: my-resource-group
      containerInstanceVNet: my-vnet
      containerInstanceSubnet: my-subnet
```

## Parameters

| param                          | description                                                                     | default                 | required                        |
| ------------------------------ | ------------------------------------------------------------------------------- | ----------------------- | ------------------------------- |
| azureSubscription              | Azure Subscription we run the script with                                       |                         | true                            |
| appName                        | The name of the app in the Azure account                                        |                         | true                            |
| responseCheckString            | String to find in response payload to check if healthcheck success              | `version`               | false                           |
| endpoint                       | The endpoint to call                                                            |                         | true                            |
| endpointType                   | Weather the endpoint is exposed on public network. Value: `public` or `private` |                         | true                            |
| headers                        | If needed add custom headers to HTTP request in `KEY=VALUE` format              |                         | false                           |
| containerInstanceCpu           | Max container CPU allocation                                                    | 0.5 (minimum allocable) | only if `endpointType: private` |
| containerInstanceMemory        | Max container memory allocation                                                 | 0.5 (minimum allocable) | only if `endpointType: private` |
| containerInstanceResourceGroup | The resource group the container is mounted with                                |                         | only if `endpointType: private` |
| containerInstanceVNet          | The VNet the container is mounted onto                                          |                         | only if `endpointType: private` |
| containerInstanceSubnet        | The subnet the container is mounted onto                                        |                         | only if `endpointType: private` |
