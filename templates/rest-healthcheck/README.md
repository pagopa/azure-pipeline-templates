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

| param                          | description                                                         | default                 |
| ------------------------------ | ------------------------------------------------------------------- | ----------------------- |
| azureSubscription              | Azure Subscription we run the script with                           |                         |
| appName                        | The name of the app in the Azure account                            |                         |
| endpoint                       | The endpoint to call                                                |                         |
| endpointType                   | Set if endpoint is public or private                                |                         |
| headers                        | Set custom headers                                                  |                         |
| containerInstanceCpu           | Max container CPU allocation (only for private)                     | 0.5 (minimum allocable) |
| containerInstanceMemory        | Max container memory allocation (only for private)                  | 0.5 (minimum allocable) |
| containerInstanceResourceGroup | The resource group the container is mounted with (only for private) |                         |
| containerInstanceVNet          | The VNet the container is mounted onto (only for private)           |                         |
| containerInstanceSubnet        | The subnet the container is mounted onto (only for private)         |                         |
