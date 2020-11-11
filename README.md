# azure-pipeline-templates
A collection of common Azure Pipeline tasks to be used across out projects

## Usage
Templates are meant to be included into a project pipeline. Please refer to [this guide](https://github.com/MicrosoftDocs/azure-devops-docs/blob/master/docs/pipelines/process/templates.md#use-other-repositories) for examples.

### Best practices
* Always include templates in your pipeline specifying the reference tag, so a new template version can never break your deploy workflow.
* When writing templates, make little-to-no use of default values. Istead, pretend the hist pipeline to provide them.

## Available templates

### Rest Healtcheck
Perform HTTP requests to a given endpoint of the app being processed. It is intended to be used as a check before promoting a slot into production.
Requests are made inside a container which needs to be mounted using specific networking configurations and grants.

|param|description|default|
|-|-|-|
|azureSubscription|Azure Subscription we run the script with||
|appName|The name of the app in the Azure account||
|path|The path of the endpoint to call, **without leading `/`**||
|protocol|Protocol to be used to call the endpoint|https|
|containerInstanceCpu|Max container CPU allocation|0.5 (minimum allocable)|
|containerInstanceMemory|Max container memory allocation|0.5 (minimum allocable)|
|containerInstanceResourceGroup|The resource group the container is mounted with||
|containerInstanceVNet|The VNet the container is mounted onto||
|containerInstanceSubnet|The subnet the container is mounted onto||


## Contributing

### Create a new template
* Create a dedicate `yaml` file in `/templates`, with an appropiate name.
* Please remember that templates are not inheritedly bound to any specific project or tech: if the template works only on a specific context, make it explicit (example: prefer `npm-publish.yaml` to `publish.yaml` when writing a template to publish a module on npm).
* Create a section on this README with a brief description of the template and the full list of parameters.

### Release a new version
To mark a new version, use the `release.sh` script.
