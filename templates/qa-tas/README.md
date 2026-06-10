# TAS — Azure DevOps Templates

This folder hosts the official Azure DevOps templates published by the
Test Automation Service (TAS) team for external consumers.

| Template | Purpose |
|---|---|
| [`tas-integration-tests.yml`](./tas-integration-tests.yml) | All-in-one entry point to run TAS integration tests from an ADO pipeline. Supports the `sync`, `async` and `raw` invocation modes behind a single, parameterised stage. |

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

- `variables:` declared in mapping syntax (`KEY: value`) instead of the
  sequence syntax required to import a variable group — the silent root
  cause of `HTTP 401 Bad credentials` errors at dispatch time.
- The PAT interpolated into the rendered shell script via the ADO macro
  `$(INTEGRATION_TEST_PAT)` instead of being read from the shell env
  (`$INTEGRATION_TEST_PAT`).
- Output variables exposed under different step names (`trigger`,
  `dispatch`, …) depending on the invocation mode, forcing the caller to
  rewrite its `stageDependencies[...].outputs[...]` path when switching
  between modes.

The template normalises all of the above behind a stable public contract.

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
      name: pagopa/pagopa-platform-integration-test
      ref: refs/heads/main          # or refs/tags/v1 to pin a version
      endpoint: pagoPA-projects     # your GitHub service connection name

stages:
  - template: .azuredevops/templates/tas-integration-tests.yml@tas
    parameters:
      suite: wisp
      environment: uat
      mode: sync                    # sync | async | raw
```

A complete consumer example (including the `Deploy` stage that reads the
template's outputs) is available at
[`../../docs/tas/examples/tas-example-ado-using-template.yml`](../../docs/tas/examples/tas-example-ado-using-template.yml).

The full integration guide, including prerequisites (PAT, variable
group, GitHub service connection) and the rationale for each
invocation mode, lives in
[`../../docs/tas/tas-developer-guide.md`](../../docs/tas/tas-developer-guide.md) — see the
"**Option 5 — Official Azure DevOps template**" section.

---

## Public contract

Anything documented in this section is part of the template's stable API.
Changes to these identifiers are released under a new major tag (e.g.
`v1` → `v2`); internal refactors that preserve the contract ship on the
same tag.

### Stage / job / step names

| Identifier | Value |
|---|---|
| Stage name | `TAS_IntegrationTests` |
| Job name | `RunTAS` |
| Step name (output publisher) | `tas` |

### Input parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `suite` | string | `wisp` | Test suite: `wisp` or `all` |
| `environment` | string | `uat` | Target environment: `dev` or `uat` |
| `mode` | string | `sync` | Invocation mode: `sync`, `async`, or `raw` |
| `ref` | string | `main` | TAS repo branch/tag to run the tests from |
| `secretsGroup` | string | `tas-integration-secrets` | Variable group containing `INTEGRATION_TEST_PAT` |
| `pythonVersion` | string | `3.11` | Python version (orchestrator-based modes only) |
| `tasRepo` | string | `pagopa/pagopa-platform-integration-test` | TAS repository |
| `workflowFile` | string | `test-automation-service.yml` | TAS workflow file |
| `poolVmImage` | string | `ubuntu-latest` | Agent image |
| `verifyOrchestrator` | boolean | `true` | Verify the SHA-256 of `tas_orchestrator.py` after download |
| `orchestratorSha256` | string | `""` | Pinned SHA-256 hex digest of `tas_orchestrator.py`. When set, it overrides the published sidecar and provides true SRI even if the `ref` is mutated |

### Output variables

Read with:

```yaml
$[ stageDependencies.TAS_IntegrationTests.RunTAS.outputs['tas.<NAME>'] ]
```

| Variable | `sync` | `async` | `raw` | Description |
|---|:---:|:---:|:---:|---|
| `CORRELATION_ID` | ✅ | ✅ | ✅ | Identifier used to locate the run (`run-name: tas-<id>`) |
| `RUN_ID` | ✅ | — | — | GHA workflow run numeric ID |
| `RUN_URL` | ✅ | — | — | Direct URL to the GHA run |

In modes where a variable is not produced, the value is an **empty string**.
Downstream jobs can branch on it with `condition: ne(variables.RUN_ID, '')`.

---

## Prerequisites for consumers

1. **Variable group** named `tas-integration-secrets` (overridable via the
   `secretsGroup` parameter) containing:
  - `INTEGRATION_TEST_PAT` — GitHub PAT, secret, scopes
    `public_repo` + `actions:read`.

   Authorise the consuming pipeline:
   *Library → Variable group → Pipeline permissions → +*.

2. **GitHub service connection** in the ADO project:
   *Project settings → Service connections → New service connection → GitHub*.

   The name of the connection goes into `resources.repositories[].endpoint`
   in the caller's YAML.

---

## Versioning policy

| Change type | Example | Released as |
|---|---|---|
| Contract-preserving fix or internal refactor | Better error message, faster bootstrap, new optional parameter with a default | Same major tag (e.g. `v1`) |
| Breaking change to inputs/outputs/names | Removed parameter, renamed output variable, renamed stage | New major tag (`v2`) |

Consumers that prioritise stability **pin a tag** (`ref: refs/tags/v1`);
consumers that prioritise always running the latest fixes track
`refs/heads/main`.

---

## Supply-chain integrity

`tas_orchestrator.py` is fetched at job time from
`raw.githubusercontent.com`. To detect tampering or partial downloads the
template verifies its SHA-256 before executing it. Two modes are supported:

### Sidecar mode (default)

The template downloads `scripts/tas_orchestrator.py.sha256` from the **same
`ref`** and runs `sha256sum -c`. This is published and maintained by the
TAS team alongside the script. The guarantee is "the script I just
downloaded matches the digest the TAS team published on this ref" — its
strength is therefore tied to how trusted the ref is. Pin a tag
(`refs/tags/v1`) rather than a moving branch for maximum value.

### Pinned mode (recommended for strict supply-chain requirements)

Set `orchestratorSha256` to the expected hex digest. The template
verifies the download against that value and **ignores the sidecar**.
This is true Subresource-Integrity-style protection: it survives even
tampering of the ref tip, at the cost of an explicit upgrade step
whenever the orchestrator changes.

Compute the digest of the version you trust:

```bash
curl -sSfL https://raw.githubusercontent.com/pagopa/pagopa-platform-integration-test/refs/tags/v1/scripts/tas_orchestrator.py \
  | sha256sum
```

then bake it into the caller:

```yaml
- template: .azuredevops/templates/tas-integration-tests.yml@tas
  parameters:
    # ...
    orchestratorSha256: "a68b6c43c98517352c6d182df4a97b67e33a94ed79ae56949b1f6e6a179b5fe1"
```

### Opting out

Set `verifyOrchestrator: false` to skip verification entirely. Not
recommended — keep the default on unless you have a specific reason.

---

## Where to ask for help

- Open an issue on
  [`pagopa/pagopa-platform-integration-test`](https://github.com/pagopa/pagopa-platform-integration-test/issues).
- For integration questions not specific to ADO, see the general
  [TAS developer guide](../../docs/tas/tas-developer-guide.md).

