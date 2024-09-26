# Apim values get template

Reads a list of named values from the given APIm and saves them as output

The outputs are saved to a variable named after the given named value, replacing dashes with underscores (as per AZ DevOps requirement);
for example, given "my-named-value" as the id of the named value, the output will be `my_named_value.my-named-value`


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
      - job: get_current_values
        displayName: "Retrieve current APIM named values"
        condition: succeeded()
        steps:
        - template: templates/apim-get-values/template.yaml@terraform
          parameters:
            AZURE_APPLY_SERVICE_CONNECTION_NAME: "${{variables.azureServiceConnectionApplyName}}"
            APIM_NAME: "${{variables.apimName}}"
            APIM_RG: "${{variables.apimRg}}"
            NAMED_VALUES:
              - my-value
              - my-value-2
      #
      # how to access the values
      #
      - job: accessing_values
        displayName: "printing named values"
        condition: succeeded()
        dependsOn: get_current_values #required
        variables:
          my-read-value: $[ dependencies.get_current_values.outputs['my_value.my-value'] ] #variable container name has underscores instead of dashes
          my-read-value-2: $[ dependencies.get_current_values.outputs['my_value_2.my-value-2'] ] #variable container name has underscores instead of dashes
        steps:
          - bash: |
              echo $(my-read-value)
              echo $(my-read-value-2)
```
