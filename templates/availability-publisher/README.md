# Availability publisher

This template is used to publish an availability event to Azure Application Insight for a pipeline/environment
It is useful to track the execution of a pipeline and create alerts based on that information.

This template will publish an availablity event with the `runLocation` field set to the value of `ENVIRONMENT` parameter 

## Usage

### As job

Include the template `templates/availability-publisher/template-job.yaml` to use the pre-packaged job which automatically tracks the success or failure availability of the job specified in `DEPENDS_ON`

The availability is based on the result of the `succeeded()` and `failed()` function as documented [here](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/expressions?view=azure-devops#failed)

```yaml
    jobs:
      #this is the job you want to track
      - job: my_job 
        strategy:
          parallel: 1
        timeoutInMinutes: ${{parameters.TIME_OUT}}
        steps:
         [..]
      # availability tracking job  
      - template: templates/availability-publisher/template-job.yaml@terraform
        parameters:
          APP_INSIGHT_CONNECTION_STRING: ${{ parameters.APP_INSIGHT_CONNECTION_STRING }}
          PIPELINE_NAME: $(System.DefinitionName)
          ENVIRONMENT: ${{ parameters.ENV }}
          DEPENDS_ON: my_job # set the dependency to the job you want to track 
```
#### Inputs

| Name                          | Type   | Description                                                                                              | Default |
|-------------------------------|--------|----------------------------------------------------------------------------------------------------------|---------|
| APP_INSIGHT_CONNECTION_STRING | string | (Required) The connection string to the Application Insight instance.                                    | -       |
| PIPELINE_NAME                 | string | (Required) Name of the pipeline to be tracked. use `$(System.DefinitionName)` to use the definition name | -       |
| ENVIRONMENT                   | string | (Required) Name of the environment on which the pipeline is running                                      | -       |
| DEPENDS_ON                    | string | (Required) Job identifier that will be monitored                                                         | -       |



### As step

Include the template `templates/terraform-setup/template.yaml` in your job as the last step if you want to use the functionality as a step. 
In this case you'll have to manually specify the success status of your job using the `SUCCESS` parameter.

When the job fails, this step will be skipped and no availability will be tracked. 
Be careful when setting up alerts on this availability metric and make sure to treat missing data as failures to cover the case of pipeline failures


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
        # your pipeline steps
        - checkout: self
        - template: templates/terraform-setup/template.yaml@terraform
          parameters:
            USE_SOPS: ${{ parameters.USE_SOPS }}
        - template: templates/terraform-summarize/template.yaml@terraform
        - template: templates/terraform-plan/template.yaml@terraform
          parameters:
            [...]
        # availability tracking step    
        - template: templates/availability-publisher/template-step.yaml@terraform
          parameters:
            APP_INSIGHT_CONNECTION_STRING: ${{ parameters.APP_INSIGHT_CONNECTION_STRING }}
            PIPELINE_NAME: $(System.DefinitionName)
            ENVIRONMENT: ${{ parameters.ENV }}
            SUCCESS: true
```

#### Inputs

| Name                          | Type    | Description                                                                                              | Default |
| ----------------------------- | ------- |----------------------------------------------------------------------------------------------------------|---------|
| APP_INSIGHT_CONNECTION_STRING | string  | (Required) The connection string to the Application Insight instance.                                    | -       |
| PIPELINE_NAME                 | string  | (Required) Name of the pipeline to be tracked. use `$(System.DefinitionName)` to use the definition name | -       |
| ENVIRONMENT                   | string  | (Required) Name of the environment on which the pipeline is running                                      | -       |
| SUCCESS                       | boolean | Set to true if the pipeline was successful, false otherwise.                                             | false   |



