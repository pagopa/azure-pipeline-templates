# Apim values set template

Updates a set of named values on the given apim based on the configuration



## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/<tag>

stages:
  - stage: my_stage
    pool:
      name: "${{variables.poolName}}"

    jobs:
      - job: "update_my_values"
        displayName: "Updating some values on apim"
        condition: succeeded()
        steps:
        - template: templates/apim-set-values/template.yaml@templates
          parameters:
            AZURE_APPLY_SERVICE_CONNECTION_NAME: "${{variables.azureServiceConnectionApplyName}}"
            APIM_NAME: "my-apim-name"
            APIM_RG: "my-apim-rg-name"
            NAMED_VALUES:
              - name: named-value-id-1
                value: new-value-1
              - name: named-value.idd-2
                value: new-value-2
```
