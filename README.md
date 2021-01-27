# azure-pipeline-templates
A collection of common Azure Pipeline tasks to be used across out projects

## Usage
Templates are meant to be included into a project pipeline. Please refer to [this guide](https://github.com/MicrosoftDocs/azure-devops-docs/blob/master/docs/pipelines/process/templates.md#use-other-repositories) for examples.

### Best practices
* Always include templates in your pipeline specifying the reference tag, so a new template version can never break your deploy workflow.
* When writing templates, make little-to-no use of default values. Instead, pretend the hist pipeline to provide them.

## Available templates

* [Rest Healthcheck](templates/rest-healthcheck)
* [Node Github Release](templates/node-github-release)
* [Terraform Setup](templates/terraform-setup)
* [Node Job Setup template](templates/node-job-setup)

## Contributing

### Create a new template
* Create a dedicate folder in `/templates`, with the name of the template.
* Please remember that templates are not inheritedly bound to any specific project or tech: if the template works only on a specific context, make it explicit (example: prefer `npm-publish` to `publish` when writing a template to publish a module on npm).
* In the folder create a `yaml` file (naming isn't really important, you can call it `index.yaml` or `template.yaml`).
* In the same folder add a specific README file with:
  * a brief description of the template
  * an example snippet to describe usage
  * a full parameters table
* Add an entry in the `Available templates` section of the repo main README (this file), with a link to the README of the template you just created.

### Release a new version
New versions are created automatically on each merge on master branch. In the need of creating a release manually, use the `release.sh` script.
