# Node Yarn Job Setup template

Ideally all the steps needed at the beginning of a new job when working on a Node.js project with `yarn`. The templates does the following:

1. checkout code
1. setup Node.js
1. install dependencies


## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/v5

jobs:
- template: templates/node-yarn-job-setup/template.yaml@templates 
```

## Parameters

|param|description|default|
|-|-|-|
|persistCredentials|(optional) Proxy the same parameter trough the `checkout` task. Read more on [Azure DevOps documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema#checkout). |`false`|
|gitReference|(optional) The branch, tag or commit to checkout. This is needed when the job must point to a different commit than the one which triggered the pipeline. The common case is when a previous stage pushed another commit on the source repo. |`none`|
|nodeVersion|(optional) Specific Node.js version to be used. Usually there's no need to use this parameter as version can be inferred reading `.node-version` or `.nvmrc` files from the project root. |`none`|
