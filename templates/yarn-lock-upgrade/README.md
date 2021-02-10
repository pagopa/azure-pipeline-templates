# Yarn.lock file upgrade template

A sequence of steps to upgrade yarn.lock file and make a PR to github. 

It does the following:

1. do _yarn install_ 
1. check whether if yarn.lock file has changed, if so:
  1. create a new branch
  1. create a commit for the yarn.lock file
  1. make a PR

Be sure that this template is called intoyarn a shceduled pipeline


## Usage

```yaml

# A pipeline with no CI trigger, just schedules
trigger: none
pr: none

schedules:
  - cron: "0/5 * * * *"
    displayName: Daily yarn.lock upgrade
    branches:
      include:
      - master
    always: true # Run always irrespective of changes



resources:
  repositories:
    - repository: pagopaCommons
      type: github
      name: pagopa/azure-devops-templates
      ref: refs/tags/v[n]

...

stages:

  # Publish client SDK to 
  - stage: UpgradeYarnLockFile
    pool:
      vmImage: 'ubuntu-latest'
    jobs:
      - job: do_yarn_lock_upgrade   
        steps:
        - template: templates/yarn-lock-upgrade/template.yaml@templates

```
