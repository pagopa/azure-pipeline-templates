# Install azurerm terraform custom provider

Install azurerm cutom provider in a debian-based linux agent.
When for some reason it is requierd to work with an azurerm custom provider.


```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v6

jobs:
- template: templates/terraform-custom-azurerm/template.yaml@templates
```
## Paramenter

* AZURERM_PROVIDER_CUSTOM_VERSION the version of the custom provider.
* AZURERM_PROVIDER_CUSTOM_RELEASE the release of the custom provider.

Set both of them to none wheter you do not want to install the custom provider.