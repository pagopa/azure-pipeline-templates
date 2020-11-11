# azure-pipeline-templates
A collection of common Azure Pipeline tasks to be used across out projects

## Usage
Templates are meant to be included into a project pipeline. Please refer to [this guide](https://github.com/MicrosoftDocs/azure-devops-docs/blob/master/docs/pipelines/process/templates.md#use-other-repositories) for examples.

### Best practices
* Always include templates in your pipeline specifying the reference tag, so a new template version can never break your deploy workflow.
* When writing templates, make little-to-no use of default values. Istead, pretend the hist pipeline to provide them.

## Available templates

## Contributing

### Create a new template
* Create a dedicate `yaml` file in `/templates`, with an appropiate name.
* Please remember that templates are not inheritedly bound to any specific project or tech: if the template works only on a specific context, make it explicit (example: prefer `npm-publish.yaml` to `publish.yaml` when writing a template to publish a module on npm).
* Create a section on this README with a brief description of the template and the full list of parameters.

### Release a new version
To mark a new version, use the `release.sh` script.
