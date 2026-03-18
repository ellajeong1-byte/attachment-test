# Writers' Room OS — Workflow State Model System

## Purpose

Define a deterministic, project-scoped state model for the AI Writers' Room workflow engine that supports:
- stage progression,
- stage failure,
- revision loops,
- Director intervention,
- project-specific workflow variants,
- and a separate translation task state machine.

---

## 1) Full state model

The model has 4 coordinated state spaces:
1. `workflow_run_state` (overall run lifecycle)
2. `stage_state` (state of each stage in a run)
3. `review_state` (Director gate and decision outcomes)
4. `translation_task_state` (separate branch engine)

## 1.1 Workflow run states (default writing pipeline)

```text
workflow_not_started
workflow_ready
workflow_running
workflow_paused
workflow_blocked
workflow_failed
workflow_awaiting_director
workflow_revision_requested
workflow_approved
workflow_rejected
workflow_archived
```

### Meaning
- `workflow_not_started`: work unit created, no stage initialized.
- `workflow_ready`: first executable stage is ready.
- `workflow_running`: orchestrator is actively executing stage chain.
- `workflow_paused`: intentionally stopped by user/system.
- `workflow_blocked`: hard dependency/policy/canon issue prevents progression.
- `workflow_failed`: unrecoverable stage error without retry success.
- `workflow_awaiting_director`: reached Director gate, waiting human decision.
- `workflow_revision_requested`: Director requested reroute to earlier stage.
- `workflow_approved`: Director approved current revision cycle.
- `workflow_rejected`: Director rejected and flow remains unresolved.
- `workflow_archived`: finalized and moved out of active execution.

---

## 1.2 Stage states

```text
not_started
ready
context_assembling
in_progress
completed
failed
blocked
stale
revision_requested
approved
rejected
skipped
```

### Meaning
- `not_started`: stage exists in template but untouched.
- `ready`: all required dependencies satisfied; can run.
- `context_assembling`: role-specific input bundle is being built.
- `in_progress`: model execution running.
- `completed`: output validated/persisted.
- `failed`: stage execution failed validation/runtime.
- `blocked`: required input or policy violation prevents run.
- `stale`: downstream output invalidated by revision upstream.
- `revision_requested`: selected as reroute target by Director.
- `approved`: stage accepted by Director in this cycle.
- `rejected`: stage output explicitly rejected by Director.
- `skipped`: intentionally bypassed by workflow variant rule.

---

## 1.3 Canonical fiction/webnovel stage keys and mapped states

Stage keys:
- `trend`
- `structure`
- `tone`
- `continuity`
- `draft`
- `director_review`

User-facing state aliases (optional):
- `trend_pending` -> `trend:ready`
- `trend_completed` -> `trend:completed`
- `structure_pending` -> `structure:ready`
- `structure_completed` -> `structure:completed`
- `tone_pending` -> `tone:ready`
- `tone_completed` -> `tone:completed`
- `continuity_pending` -> `continuity:ready`
- `continuity_completed` -> `continuity:completed`
- `draft_pending` -> `draft:ready`
- `draft_completed` -> `draft:completed`
- `director_review_pending` -> `director_review:ready`
- `revision_requested` -> `workflow_revision_requested`
- `approved` -> `workflow_approved`
- `rejected` -> `workflow_rejected`

(Recommended: store normalized states, expose aliases only in UI.)

---

## 1.4 Director review states

```text
director_pending
director_in_review
director_approved
director_conditionally_approved
director_rejected
```

---

## 1.5 Translation task states (separate engine)

```text
translation_requested
translation_queued
translation_context_ready
translation_in_progress
translation_completed
localization_review_pending
translation_revision_requested
translation_rejected
translation_failed
translation_canceled
translation_archived
```

Translation state machine is independent from writing workflow state machine.

---

## 2) Transition logic

## 2.1 Default writing pipeline transitions

```text
workflow_not_started -> workflow_ready
workflow_ready -> workflow_running
workflow_running -> workflow_awaiting_director
workflow_running -> workflow_paused
workflow_running -> workflow_blocked
workflow_running -> workflow_failed
workflow_awaiting_director -> workflow_approved
workflow_awaiting_director -> workflow_revision_requested
workflow_awaiting_director -> workflow_rejected
workflow_revision_requested -> workflow_running
workflow_approved -> workflow_archived
workflow_rejected -> workflow_revision_requested | workflow_archived
```

## 2.2 Stage transition sequence

For non-director stages:

```text
not_started -> ready
ready -> context_assembling
context_assembling -> in_progress
in_progress -> completed | failed | blocked
completed -> approved | stale
failed -> ready (retry) | blocked | rejected
blocked -> ready (on dependency fix) | rejected
stale -> ready (on rerun scheduling)
revision_requested -> context_assembling
```

For director stage:

```text
not_started -> ready -> in_progress -> completed
completed -> approved | revision_requested | rejected
```

## 2.3 Transition guards

Transitions only permitted when guards pass:
- dependency guard: required upstream outputs exist and are latest.
- context guard: role bundle assembled with required slices.
- schema guard: stage output validates against stage output schema.
- policy guard: project language/style/compliance constraints satisfied.
- revision guard: reroute target stage valid in active workflow graph.

Guard failure sets `blocked` or `failed` with diagnostic reason.

---

## 3) Revision routing logic

## 3.1 Trigger
Revision starts only from Director actions:
- `director_conditionally_approved`
- `director_rejected`

Required routing fields:
- `revision_cycle_id`
- `target_stage_key`
- `revision_reason`
- `required_changes`

## 3.2 Routing algorithm

1. Mark workflow `workflow_revision_requested`.
2. Mark `target_stage` as `revision_requested`.
3. Mark all downstream stages as `stale`.
4. Preserve existing outputs as immutable historical versions.
5. Requeue target stage (`ready` -> `context_assembling`).
6. Auto-run forward through downstream stages.
7. Stop again at Director (`workflow_awaiting_director`).

## 3.3 Failure during revision
If rerun stage fails:
- stage -> `failed` or `blocked`
- workflow -> `workflow_failed` or `workflow_blocked`
- revision cycle remains `open`
- Director can retry/retarget/archive.

## 3.4 Memory linkage in revision
Every rerun must store:
- `revision_cycle_id`
- `supersedes_stage_run_id`
- `memory_delta_id`
- `decision_reference_id`

This preserves continuity and auditability over cycles.

---

## 4) Project-specific workflow variants

## 4.1 Invariant core (must remain)
Regardless of project type, state system always includes:
- run-level states,
- stage-level states,
- Director gate states,
- revision routing mechanics,
- immutable output versioning,
- separate translation state machine.

## 4.2 Variant stage graphs by project type

### Fiction/webnovel (default)
`trend -> structure -> tone -> continuity -> draft -> director_review`

### Literary chapter workflow (example)
`trend -> structure -> tone -> voice_audit -> continuity -> draft -> director_review`

### Nonfiction/essay workflow (example)
`argument_positioning -> structure -> evidence_map -> tone -> fact_integrity -> draft -> director_review`

### Workbook/educational workflow (example)
`audience_goal_fit -> pedagogy_sequence -> clarity_tone -> fact_integrity -> draft -> director_review`

## 4.3 How variants extend state model safely

- add new stage keys; reuse same normalized stage state set.
- add `skipped` semantics for optional stages in certain projects.
- dependency graph defines legal transitions between added stages.
- Director stage remains terminal gate in writing pipeline.

No variant may remove:
- stage dependency validation,
- memory update and log persistence,
- revision loop support,
- Director intervention requirement.

---

## 5) Recommended persistence schema for states

### `workflow_runs`
- `id`
- `project_id`
- `work_unit_id`
- `workflow_template_key`
- `workflow_run_state`
- `current_stage_key`
- `revision_cycle`
- `director_review_state`
- `started_at`, `updated_at`, `ended_at`

### `stage_runs`
- `id`
- `workflow_run_id`
- `project_id`
- `work_unit_id`
- `stage_key`
- `stage_state`
- `attempt_no`
- `context_bundle_id`
- `output_artifact_id`
- `memory_delta_id`
- `revision_cycle_id`
- `supersedes_stage_run_id`
- `error_code`, `error_message`
- `started_at`, `completed_at`

### `translation_tasks`
- `id`
- `project_id`
- `work_unit_id` (nullable)
- `source_artifact_id`
- `target_language`
- `translation_task_state`
- `localization_review_state`
- `requested_by`
- `requested_at`, `updated_at`, `completed_at`

### `state_transition_logs`
- `id`
- `project_id`
- `workflow_run_id`
- `entity_type` (`workflow` | `stage` | `translation_task`)
- `entity_id`
- `from_state`
- `to_state`
- `trigger`
- `triggered_by`
- `metadata`
- `created_at`

---

## 6) Practical transition examples

## Example A — Happy path (fiction)
1. `workflow_ready`
2. trend/structure/tone/continuity/draft each: `ready -> ... -> completed`
3. workflow -> `workflow_awaiting_director`
4. Director approve
5. workflow -> `workflow_approved`

## Example B — Conditional approval revision
1. workflow at Director: `workflow_awaiting_director`
2. Director conditional approve targeting `structure`
3. workflow -> `workflow_revision_requested`
4. structure -> `revision_requested`; tone/continuity/draft -> `stale`
5. rerun from structure to draft
6. stop at Director again

## Example C — Translation task
1. explicit request creates task: `translation_requested`
2. task -> `translation_in_progress`
3. task -> `translation_completed`
4. optional human check -> `localization_review_pending`

Translation state changes do not alter `workflow_run_state`.

---

## 7) Operational principles

- Store normalized states, map human-readable aliases in UI only.
- Never overwrite old stage outputs on rerun; append new version.
- State transitions must be logged for audit and replay.
- Cross-project transition or retrieval is forbidden.
- Director decision is required for final writing progression.
