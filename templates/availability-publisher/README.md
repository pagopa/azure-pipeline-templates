# Availability publisher

This template is used to publish an availability event to Azure Application Insight for a pipeline/environment
It is useful to track the execution of a pipeline and create alerts based on that information.

## Inputs

| Name                          | Type    | Description                                                                                              | Default |
| ----------------------------- | ------- |----------------------------------------------------------------------------------------------------------|---------|
| APP_INSIGHT_CONNECTION_STRING | string  | (Required) The connection string to the Application Insight instance.                                    | -       |
| PIPELINE_NAME                 | string  | (Required) Name of the pipeline to be tracked. use `$(System.DefinitionName)` to use the definition name | -       |
| ENVIRONMENT                   | string  | (Required) Name of the environment on which the pipeline is running                                      | -       |
| SUCCESS                       | boolean | Set to true if the pipeline was successful, false otherwise.                                             | false   |


## Usage

As a stage
```yaml
  - stage: publish_status
    displayName: 'Publish pipeline status'
    condition: succeeded()
    jobs:
    - job: availability_publish
      strategy:
        parallel: 1
      timeoutInMinutes: ${{parameters.TIME_OUT}}
      steps:
        - template: templates/availability-publisher/template.yaml@terraform
          parameters:
            APP_INSIGHT_CONNECTION_STRING: ${{ parameters.APP_INSIGHT_CONNECTION_STRING }}
            PIPELINE_NAME: $(System.DefinitionName)
            ENVIRONMENT: ${{ parameters.ENV }}
            SUCCESS: true 
```

As a job
```yaml
    jobs:
      - job: my_job
        strategy:
          parallel: 1
        timeoutInMinutes: ${{parameters.TIME_OUT}}
        steps:
         [..]
      - template: templates/availability-publisher/template.yaml@terraform
        parameters:
          APP_INSIGHT_CONNECTION_STRING: ${{ parameters.APP_INSIGHT_CONNECTION_STRING }}
          PIPELINE_NAME: $(System.DefinitionName)
          ENVIRONMENT: ${{ parameters.ENV }}
          DEPENDS_ON: my_job
```
