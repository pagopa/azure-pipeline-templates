# Maven GitHub Release template

Opinionated sequence of steps to mark a new release of a Maven project hosted on a Github repository. It does the following:

1. bump the version according to a given [SemVer](https://semver.org/) option (`major`, `minor`, `patch`, `buildNumber` or `skip`).
1. tag the repository with the new version number
1. push changes and tags to the repository
1. creates a GitHub release from the release tag

Be sure that code is checked-out using `persistCredentials: true` in the `checkout` step. Also be aware that the template commits **every** change on the release branch, thus be sure you only edit file you intend to include in the commit.

The template does not make any assumption on any specific maven version nor dependency to be installed. Please perform setup **before** including the template.

Note: 
* Passing `skip` no bump is done.
* Passing `buildNumber` the `release_branch` is appended to the version and no GitHub release is done (es: `1.0.2-1-branchName`)

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: refs/tags/v1

jobs:
- checkout: self
  persistCredentials: true

- template: templates/maven-github-release/template.yaml@templates
  parameters:
    semver: 'minor' # or major or patch or buildNumber or skip
    release_branch: 'your-branch-name'
    gitEmail: 'janedoe@company.com'
    gitUsername: 'JaneDoe'
    gitHubConnection: 'company_gh_connection'
```

## Parameters

|param|description|default|
|-|-|-|
|semver|The rule to bump the version with||
|gitEmail|The email of the Github user which authors the version bump commit ||
|gitUsername|The username of the Github user which authors the version bump commit ||
|gitHubConnection|The service connection used by the Azure Pipeline to connect to Github||
