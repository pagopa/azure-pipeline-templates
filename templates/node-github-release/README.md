# Node Github Release template

Opinionate sequence of steps to mark a new release of a Nodejs project hosted on a Github repository. It does the following:

1. checkout a given release branch (usually `master`)
1. bump the version according to a given [SemVer](https://semver.org/) option (`major`, `minor` or `patch`)
1. tag the repository with the new version number
1. push changes and tags to the repository
1. creates a Github release from the release tag

Dependencies are installed using `yarn`. They are needed because the application may define some custom `preversion`, `version` and/or `postversion` scripts that may require some external package.

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: refs/tags/v1

jobs:
- template: templates/node-github-release/template.yaml@templates 
  parameters:
    semver: 'minor' # or major or patch
    gitEmail: 'janedoe@company.com'
    gitUsername: 'JaneDoe'
    gitHubConnection: 'company_gh_connection'
    nodeVersion: '10.19.0'
    pkg_cache_version_id: 'v1'
    pkg_cache_folder: $(Pipeline.Workspace)/.yarn
```

## Parameters

|param|description|default|
|-|-|-|
|semver|The rule to bump the version with||
|gitEmail|The email of the Github user which authors the version bump commit ||
|gitUsername|The username of the Github user which authors the version bump commit ||
|gitHubConnection|The service connection used by the Azure Pipeline to connect to Github||
|nodeVersion|The version of Node to use||
|pkg_cache_version_id|Used by the package cache, identifies the cache version ||
|pkg_cache_folder|Used by the package cache, the folder where cached package are persisted by the pipeline ||
