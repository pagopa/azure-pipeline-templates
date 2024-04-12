# Postgres flexible failover

Executes the failover onto a replica postgres flexible server and updates the private dns record referencing the db


## Usage

```yaml
resources:
  repositories:
    - repository: terraform
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/heads/main
      endpoint: "io-azure-devops-github-ro"
```

```yaml
  - stage: DEV
    displayName: Disaster recovery DEV
    dependsOn: []
    condition: and(succeeded(), eq(${{parameters.DEV}}, true))
    pool:
      name: "${{variables.poolNameDev}}"
    jobs:
      - job: nodo_failover
        displayName: Nodo postgres flexible failover
        strategy:
          parallel: 1
        timeoutInMinutes: $[variables.TIME_OUT]
        steps:
          - template: templates/postgres-flexible-failover/template.yaml@terraform
            parameters:
              PRIVATE_DNS_ZONE_NAME: "d.internal.postgresql.pagopa.it"
              PRIVATE_DNS_ZONE_RG_NAME: "pagopa-d-vnet-rg"
              PRIVATE_DNS_ZONE_RECORD_NAME: "nodo-db"
              FAILOVER_DB_RG: "pagopa-d-weu-nodo-db-rg"
              FAILOVER_DB_NAME: "pagopa-d-neu-nodo-replica"
              WORKINGDIR: ${{ variables.WORKING_DIR }}
              AZURE_APPLY_SERVICE_CONNECTION_NAME: "${{variables.azureServiceConnectionApplyNameDev}}"
```
