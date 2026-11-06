# TAS — Azure DevOps Templates

This folder hosts the official Azure DevOps templates published by the
Test Automation Service (TAS) team for external consumers.

| Template | Purpose |
|---|---|
| [`tas-integration-test.yml`](./tas-integration-test.yml) | All-in-one entry point to run TAS integration tests from an ADO pipeline. Supports the `sync`, `async` and `raw` invocation modes behind a single, parameterised steps template. |

---

## Why use these templates

Without the template, an ADO consumer has to maintain ~80 lines of YAML
per pipeline, replicating the bootstrap of Python, the download of
`tas_orchestrator.py`, the secret handling, the JSON payload for the
dispatch and the output-variable wiring. With the template, the same
integration boils down to ~15 lines and the boilerplate is owned by the
TAS team.

In addition, the template prevents the most common integration mistakes
observed in practice:

- The PAT interpolated into the rendered shell script via the ADO macro
  `$(INTEGRATION_TEST_PAT)` instead of being read from the shell env
  (`$INTEGRATION_TEST_PAT`).
- Output variables exposed under different step names (`trigger`,
  `dispatch`, …) depending on the invocation mode, forcing the caller to
  rewrite its `stageDependencies[...].outputs[...]` path when switching
  between modes.

The template normalises all of the above behind a stable public contract.

Variable group imports remain the caller's responsibility. When importing
a variable group, use the sequence form of `variables:` with `- group:`
and ensure the pipeline is authorised to access the group.

Being a **steps** template (rather than a stages template), it also keeps the
wrapping stage/job in the caller's hands. This means the caller controls the
stage name, its `dependsOn` (e.g. gate the tests on a previous DEV deploy) and
its `condition`, and can invoke the same template more than once in one
pipeline (e.g. one job for e2e and one for integration) — each stage/job name
only has to be unique.

---

## Quick start

```yaml
# azure-pipelines.yml (in your repository)
trigger: none
pr: none

resources:
  repositories:
    - repository: tas
      type: github
      name: pagopa/azure-pipeline-templates
      ref: refs/tags/tas-integration-tests/v1
      endpoint: pagoPA-projects     # your GitHub service connection name

stages:
  - stage: IntegrationTests
    displayName: "TAS integration tests"
    # dependsOn / condition are now fully under your control, e.g.:
    # dependsOn: DeployDev
    # condition: succeeded()
    jobs:
      - job: RunTAS
        displayName: "Run TAS"
        pool:
          vmImage: ubuntu-latest
        steps:
          - template: templates/qa-tas/tas-integration-test.yml@tas
            parameters:
              testType: integration      # integration | e2e | api
              suite: wisp
              environment: uat
              mode: sync                 # sync | async | raw
              githubToken: $(INTEGRATION_TEST_PAT)
```

A complete consumer example (including the `Deploy` stage that reads the
template's outputs) is available at
[TAS ADO consumer example](https://github.com/pagopa/pagopa-platform-integration-test/blob/main/docs/tas/examples/tas-example-ado-using-template.yml).

The linked example lives in the TAS repository; use the repository and
template path shown above when importing this template from
`pagopa/azure-pipeline-templates`.

The full integration guide, including prerequisites (PAT, variable
group, GitHub service connection) and the rationale for each
invocation mode, lives in
[TAS developer guide](https://github.com/pagopa/pagopa-platform-integration-test/blob/main/docs/tas/tas-developer-guide.md) — see the
"**Option 1 — Official Azure DevOps template**" section.

---

## Public contract

Anything documented in this section is part of the template's stable API.
Changes to these identifiers are released under a new major tag (e.g.
`v1` → `v2`); internal refactors that preserve the contract ship on the
same tag.

### Stage / job / step names

Because this is a **steps** template, the stage and job that wrap it are
declared and named by **you**, the caller. The template only owns the
publishing step, whose name is configurable via `stepName`.

| Identifier | Owner | Value |
|---|---|---|
| Stage name | caller | your choice (e.g. `IntegrationTests`) |
| Job name | caller | your choice (e.g. `RunTAS`) |
| Step name (output publisher) | template | `tas` (override with `stepName`) |

### Input parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `testType` | string | `integration` | Test category: `integration`, `e2e`, or `api` (maps to `src/<testType>/<suite>` on the TAS workflow) |
| `suite` | string | None (required) | Test suite supported by the selected TAS workflow, e.g. `wisp` or `all` |
| `environment` | string | `uat` | Target environment: `dev` or `uat` |
| `mode` | string | `sync` | Invocation mode: `sync`, `async`, or `raw` |
| `ref` | string | `main` | TAS repo branch/tag to run the tests from; independent of `resources.repositories[].ref`, which selects the template version |
| `tags` | string | `""` | Behave tag expression (e.g. `@runnable`, `@e2e`, `@a,@b`). Empty = workflow default (`@runnable`) |
| `allure` | boolean | `false` | Also produce an Allure results directory (`allure-results/`) inside the artifact (extracted under `ARTIFACT_DIR` in sync mode). Render/host is left to the caller |
| `isQualityGateRun` | boolean | `false` | Set to `true` to classify the run as Quality Gate, publish reports and AI analysis under `QG/<suite>-<testType>/<timestamp>/` with a separate suite history, and ingest with origin `QG`. Applies to sync, async and raw modes; omitted/false preserves TAS behaviour |
| `githubToken` | string | — (required) | GitHub PAT (`public_repo` + `actions:read`) forwarded as `TAS_GITHUB_TOKEN` in sync/async or `INTEGRATION_TEST_PAT` in raw. Source it from a secret pipeline variable / Key Vault–linked group |
| `pythonVersion` | string | `3.11` | Python version (orchestrator-based modes only) |
| `tasRepo` | string | `pagopa/pagopa-platform-integration-test` | TAS repository |
| `workflowFile` | string | `test-automation-service.yml` | TAS workflow file |
| `stepName` | string | `tas` | Name of the publishing step; the prefix used to read the output variables (`<stepName>.CORRELATION_ID`, …). Override when invoking the template multiple times in one job |
| `verifyOrchestrator` | boolean | `true` | Verify the SHA-256 of `tas_orchestrator.py` after download |
| `orchestratorSha256` | string | `""` | Pinned SHA-256 hex digest of `tas_orchestrator.py`. When set, it overrides the published sidecar and provides true SRI even if the `ref` is mutated |
| `publishTests` | boolean | `true` | Publish JUnit results to the ADO "Tests" tab via `PublishTestResults@2` (sync mode only — silently ignored in async/raw) |
| `testRunTitle` | string | `""` | Title shown for the published test run. Empty = auto-generated as `"TAS — <suite> / <env> (<ref>)"` |

`isQualityGateRun` is optional. In sync/async, `true` adds the orchestrator
flag `--is-quality-gate-run`; in raw, it adds the workflow input
`isQualityGateRun: "true"`. Omitted or `false` sends neither option.
Before enabling it, ensure that the template version includes the parameter
and that the orchestrator and workflow at the selected TAS `ref` support it.
Report paths, AI analysis and ingestion are implemented by TAS, not by this
template.

### Output variables

Read from a **downstream stage** with (substituting your own stage/job names):

```yaml
$[ stageDependencies.<yourStage>.<yourJob>.outputs['tas.<NAME>'] ]
```

or from another **job in the same stage** with:

```yaml
$[ dependencies.<yourJob>.outputs['tas.<NAME>'] ]
```

| Variable | `sync` | `async` | `raw` | Description |
|---|:---:|:---:|:---:|---|
| `CORRELATION_ID` | ✅ | ✅ | ✅ | Identifier used to locate the run (`run-name: tas-<id>`) |
| `RUN_ID` | ✅ | — | — | GHA workflow run numeric ID |
| `RUN_URL` | ✅ | — | — | Direct URL to the GHA run |
| `ARTIFACT_DIR` | ✅ | — | — | On-agent path where the TAS artifact (`test-summary.json`, `behave-results.json`, `junit/*.xml`) is extracted |

In modes where a variable is not produced, the value is an **empty string**.
After mapping the output to a job variable named `RUN_ID`, downstream jobs
can branch on it with `condition: ne(variables.RUN_ID, '')`.

`ARTIFACT_DIR` is a local path on the executing agent, not a shared path
between jobs. Publish and download the files as pipeline artifacts if
another job needs their contents.

---

## Prerequisites for consumers

1. **GitHub PAT** (scopes `public_repo` + `actions:read`) supplied to the
   `githubToken` parameter. Source it securely as a **secret** pipeline
   variable (or a secret from an Azure Key Vault–linked variable group) so it
  stays masked in the logs; the template forwards it as `TAS_GITHUB_TOKEN`
  in sync/async and `INTEGRATION_TEST_PAT` in raw. Never hard-code the token
  in YAML.

2. **GitHub service connection** in the ADO project:
   *Project settings → Service connections → New service connection → GitHub*.

   The name of the connection goes into `resources.repositories[].endpoint`
   in the caller's YAML.

---

## Versioning policy

| Change type | Example | Released as |
|---|---|---|
| Backward-compatible feature | New optional parameter with a default | New minor release (e.g. `tas-integration-tests/v1.1.0`); update the mobile `tas-integration-tests/v1` alias |
| Contract-preserving fix or internal refactor | Better error message, faster bootstrap | New patch release (e.g. `tas-integration-tests/v1.1.1`); update the mobile `tas-integration-tests/v1` alias |
| Breaking change to inputs/outputs/names | Removed parameter, renamed output variable | New major release (e.g. `tas-integration-tests/v2.0.0`) and mobile `tas-integration-tests/v2` alias |

`ref: refs/tags/tas-integration-tests/v1` tracks compatible releases of
major version 1. It is a mobile alias: moving it updates the template used
by existing consumers without changes to their pipeline YAML.

Consumers requiring reproducible template selection should use an immutable
versioned tag, such as `ref: refs/tags/tas-integration-tests/v1.0.0`.
Versioned release tags must not be moved. Consumers that want the latest
development changes can track `refs/heads/master`.

The optional `isQualityGateRun` parameter with default `false` is a
backward-compatible feature and does not require a new major version.
Consumers on `v1` must explicitly switch to `v2` to adopt a new major.

---

## Supply-chain integrity

`tas_orchestrator.py` is fetched at job time from
`raw.githubusercontent.com`. To detect tampering or partial downloads the
template verifies its SHA-256 before executing it in sync/async modes.
Raw mode does not download the orchestrator. The TAS `ref` parameter is
independent of the template repository version: pinning the template alone
does not pin the downloaded orchestrator. Two verification modes are supported:

### Sidecar mode (default)

The template downloads `scripts/tas_orchestrator.py.sha256` from the **same
`ref`** and runs `sha256sum -c`. This is published and maintained by the
TAS team alongside the script. The guarantee is "the script I just
downloaded matches the digest the TAS team published on this ref" — its
strength is therefore tied to how trusted the ref is. Use an immutable
TAS tag or commit rather than a moving branch or mobile tag for maximum
value.

### Pinned mode (recommended for strict supply-chain requirements)

Set `orchestratorSha256` to the expected hex digest. The template
verifies the download against that value and **ignores the sidecar**.
This is true Subresource-Integrity-style protection: it survives even
tampering of the ref tip, at the cost of an explicit upgrade step
whenever the orchestrator changes.

Compute the digest of the version you trust:

```bash
TAS_REF="YOUR_IMMUTABLE_TAS_TAG_OR_COMMIT"
curl -sSfL "https://raw.githubusercontent.com/pagopa/pagopa-platform-integration-test/${TAS_REF}/scripts/tas_orchestrator.py" \
  | sha256sum
```

then bake it into the caller:

```yaml
- template: templates/qa-tas/tas-integration-test.yml@tas
  parameters:
    # ...
    ref: "YOUR_IMMUTABLE_TAS_TAG_OR_COMMIT"
    orchestratorSha256: "YOUR_COMPUTED_SHA256_DIGEST"
```

### Opting out

Set `verifyOrchestrator: false` to skip verification entirely. Not
recommended — keep the default on unless you have a specific reason.

---

## Test reporting (ADO "Tests" tab)

In `mode: sync` the template enables the native Azure DevOps **Tests**
tab on the build summary out of the box:

1. The orchestrator step extracts the TAS artifact under
   `$(Agent.TempDirectory)/tas-artifact` (`test-summary.json`,
   `behave-results.json`, `junit/*.xml`). The path is also exposed as
   the `ARTIFACT_DIR` output variable.
2. A `PublishTestResults@2` task runs with `condition: always()` on
   `junit/*.xml`, merging the per-feature XML files into a single
   logical test run.

The task is added at compile time only when both `mode == 'sync'` and
`publishTests == true`. In `async` / `raw` the dispatch returns before
the artifact exists, so there is nothing to publish — the parameter is
silently ignored in those modes.

To customise the run title shown on the portal, pass `testRunTitle`:

```yaml
- template: templates/qa-tas/tas-integration-test.yml@tas
  parameters:
    mode:         sync
    suite:        wisp
    environment:  uat
    githubToken:  $(INTEGRATION_TEST_PAT)
    testRunTitle: "Smoke — pagopa-checkout (build $(Build.BuildId))"
```

Leave it empty to get the auto-generated default:
`TAS — <suite> / <environment> (<ref>)`.

To opt out of the publish step (e.g. because you already publish the
JUnit XML elsewhere), set `publishTests: false`. The artifact is still
extracted, so `ARTIFACT_DIR` remains usable by later steps in the same job
(e.g. uploading the extracted files to your own storage). To consume the
files from another job, publish and download them as pipeline artifacts.

**Note on `failTaskOnFailedTests`:** the orchestrator step already
fails the job on scenario failure (exit 1). The publish task is
therefore configured with `failTaskOnFailedTests: false` to avoid
marking the run failed twice for the same reason; the stage outcome
still reflects test failure thanks to the orchestrator step.

---

## Where to ask for help

- Open an issue on
  [`pagopa/pagopa-platform-integration-test`](https://github.com/pagopa/pagopa-platform-integration-test/issues).
- For integration questions not specific to ADO, see the general
  [TAS developer guide](https://github.com/pagopa/pagopa-platform-integration-test/blob/main/docs/tas/tas-developer-guide.md).

