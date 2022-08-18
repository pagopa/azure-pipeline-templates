# Deploy release number decision

Opinionated sequence of steps to outputs release number wit variable `$(deploy_version_decision.value)`.

1. `NEXT_VERSION`: if not empty string the output will be set as `deploy_version_decision.value=NEXT_VERSION`. This is the case with a deploy from main/master branch with new release version
2. `CURRENT_VERSION_TAG`: if not empty string the output will be set as `deploy_version_decision.value=CURRENT_VERSION_TAG`. This is the case with a deploy from tagged release version
3. `CURRENT_VERSION`: if not empty string the output will be set as `deploy_version_decision.value=CURRENT_VERSION-BUILD_NUMBER-SOURCE_BRANCH_NAME`. This is the case with a deploy from main/master branch without new release.
4. `CURRENT_VERSION_BRANCH`: if not empty string the output will be set as `deploy_version_decision.value=CURRENT_VERSION_BRANCH-BUILD_NUMBER-SOURCE_BRANCH_NAME`. This is the case with a deploy from a feature/long living branch without new release.
5. `BUILD_NUMBER`: automatic number generated from Azure DevOps
6. `SOURCE_BRANCH_NAME`: source branch name

## Usage

```yaml
resources:
  repositories:
    - repository: templates
      type: github
      name: pagopa/azure-devops-templates
      ref: master

  # Build
  - stage: Build
    dependsOn: Release
    variables:
      next_version: $[ stageDependencies.Release.make_release.outputs['next_version.value'] ]
      current_version: $[ stageDependencies.Release.make_release.outputs['current_version.value'] ]
      current_version_branch: $[ stageDependencies.Release.branch_version.outputs['current_version.value'] ]
      current_version_tag: $[ stageDependencies.Release.tag_version.outputs['current_version.value'] ]
    jobs:
      - job: "Build"
        steps:
          - template: templates/deploy-release-decision/template.yaml@templates
            parameters:
              NEXT_VERSION: $(next_version)
              CURRENT_VERSION: $(current_version)
              CURRENT_VERSION_BRANCH: $(current_version_branch)
              CURRENT_VERSION_TAG: $(current_version_tag)
              BUILD_NUMBER: $(Build.BuildNumber)
              SOURCE_BRANCH_NAME: $(Build.SourceBranchName)
```
