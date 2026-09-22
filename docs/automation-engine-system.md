# Writers' Room OS — Automation Engine System

## Purpose

Define the core automation engine that replaces manual baton-passing between role-specific chats.

The engine must:
- run stages in strict order,
- fetch role prompts,
- fetch project memory,
- fetch style/tone/reference context,
- assemble role input bundles,
- execute and persist outputs,
- update workflow state,
- preserve logs,
- support revision loops,
- stop at Director Review by default.

Translation is a separate optional engine and is not part of default writing pipeline.

---

## 1) Workflow engine structure

## 1.1 Engine components

### A. Workflow Definition Service
- stores workflow templates by project type,
- stores project-level workflow overrides,
- stores stage dependency graph and required I/O schemas.

### B. Orchestrator Runtime
- drives stage execution order,
- handles queueing, retries, fail/block states,
- transitions workflow state after each run.

### C. Context Assembly Service
- fetches role prompt (+ project override),
- fetches project memory slices,
- fetches style/tone profile snapshots,
- fetches reference manuscript role slices,
- fetches required prior stage outputs,
- returns immutable `context_bundle`.

### D. Stage Execution Adapter
- sends assembled context to model runtime,
- validates output schema,
- returns structured output + diagnostics.

### E. Persistence & Versioning Service
- writes stage output artifacts,
- writes memory deltas,
- writes run metadata,
- preserves append-only versions.

### F. Governance Service
- Director review gate,
- revision routing,
- approval/reject state transitions.

### G. Logging & Audit Service
- execution timeline,
- context assembly metadata,
- dependency and risk diagnostics,
- reproducibility references.

---

## 1.2 Default stage graph (fiction/webnovel)

1. Trend Strategy
2. Story Structure
3. Tone & Style / Emotional Guidance
4. Continuity Check
5. Draft Writing
6. Director Review

Graph constraints:
- every stage has required upstream dependencies,
- every stage output must pass schema validation,
- orchestration halts at Director stage by default.

---

## 2) State model

## 2.1 Work unit state

```json
{
  "work_unit_id": "unit_21",
  "project_id": "proj_01",
  "unit_type": "episode | chapter | section | module",
  "workflow_template": "template_fiction_episode_v1",
  "status": "not_started | ready | in_progress | awaiting_director | revision_requested | approved | rejected | blocked | failed",
  "current_stage": "trend_strategy",
  "next_stage": "story_structure",
  "revision_cycle": 0,
  "last_stage_run_id": "run_1001",
  "updated_at": ""
}
```

## 2.2 Stage run state

```json
{
  "stage_run_id": "run_1001",
  "project_id": "proj_01",
  "work_unit_id": "unit_21",
  "stage_key": "story_structure",
  "status": "queued | context_ready | running | completed | failed | blocked",
  "context_bundle_id": "ctx_889",
  "output_artifact_id": "out_889",
  "memory_delta_id": "mem_889",
  "error_code": null,
  "started_at": "",
  "completed_at": ""
}
```

## 2.3 Revision cycle state

```json
{
  "revision_cycle_id": "rev_12",
  "project_id": "proj_01",
  "work_unit_id": "unit_21",
  "triggered_by": "director",
  "target_stage": "story_structure",
  "reason": "midpoint pacing slack",
  "status": "open | resolved",
  "created_at": "",
  "resolved_at": ""
}
```

---

## 3) Stage handoff logic

## 3.1 Automatic baton-passing algorithm

For stage `S` in work unit `W`:

1. Resolve project + workflow + current stage.
2. Retrieve `role_prompt` and project prompt override for `S`.
3. Retrieve role-specific memory slices:
   - project memory,
   - work bible memory,
   - working memory,
   - decision/revision memory.
4. Retrieve style/tone profile snapshots.
5. Retrieve role-specific reference slices.
6. Retrieve required prior stage outputs from dependency graph.
7. Merge all above into immutable `context_bundle`.
8. Execute stage.
9. Validate output schema.
10. Persist output artifact and stage run metadata.
11. Persist memory deltas.
12. Resolve next stage and enqueue.

## 3.2 Hard guards
- missing dependency => stage `blocked`,
- schema invalid output => stage `failed`,
- severe continuity conflict => pause and escalate to Director.

## 3.3 Context merge precedence
1. Hard policy (language + compliance)
2. Director priority notes
3. Canon/work bible constraints
4. Style/tone constraints
5. Required upstream outputs
6. Working memory and references
7. Optional enrichment context

---

## 4) Revision loop handling

## 4.1 Revision trigger
Revision loop opens when Director selects `conditional_approve` or `reject`.

Required fields:
- target stage,
- revision reason,
- required changes.

## 4.2 Revision execution
1. Create revision cycle record.
2. Mark target stage `revision_requested`.
3. Mark downstream stages stale.
4. Rebuild context for target stage including revision directives.
5. Re-run target stage and auto-propagate downstream chain.
6. Return to Director Review.

## 4.3 Memory behavior in revision
- revision directives stored in Revision Memory,
- prior accepted decisions remain in Decision Memory,
- stale outputs remain archived (not overwritten),
- new outputs linked to revision cycle id.

---

## 5) Director stop-point behavior

Director is default terminal gate in creative workflow.

At Director stage:
- orchestrator pauses automatic progression,
- shows full stage outputs + diagnostics + memory deltas,
- awaits human decision.

Director actions:
- `approve` => close workflow cycle (`approved`),
- `conditional_approve` => open revision loop,
- `reject` => open blocking revision loop.

No publication/downstream release state can progress without explicit Director decision.

---

## 6) Separate translation task handling

Translation uses a separate engine (`Translation Task Engine`) and does not appear in default creative stage chain.

## 6.1 Trigger condition
Only explicit user requests can start translation, e.g.:
- Translate this project into English
- Translate this chapter into English
- Localize synopsis

## 6.2 Translation task flow
1. Validate language policy and permissions.
2. Resolve source artifact(s).
3. Build translator context bundle using:
   - project memory,
   - style/tone profile,
   - reference slices,
   - decision/revision constraints,
   - glossary/localization preferences.
4. Execute translator role.
5. Save localized artifacts linked to source version.
6. Log translation task separately from creative workflow run.

## 6.3 Separation guarantees
- translation tasks do not mutate Korean source artifacts,
- translation states do not alter creative pipeline stage states,
- translation history has separate task IDs and logs.

---

## 7) Persistent storage by project and by unit

All persistence is project-scoped and unit-scoped.

## 7.1 Core storage entities

### `work_units`
- `id`, `project_id`, `unit_type`, `status`, `current_stage`, `revision_cycle`, timestamps

### `stage_runs`
- one record per stage execution attempt
- includes context/output refs and run status

### `stage_outputs`
- append-only artifacts by `project_id + work_unit_id + stage + version`
- stores structured output payload + summary + diagnostics

### `context_bundles`
- immutable assembled inputs used for reproducibility

### `memory_deltas`
- per-run memory updates with promotion flags

### `execution_logs`
- timestamped operational events

### `review_events`
- Director actions and revision routing details

### `revision_cycles`
- lifecycle records for each revision loop

### `localized_artifacts` (translation engine)
- linked to source artifact id/version
- stored separately from primary Korean outputs

## 7.2 Indexing and retrieval keys
- primary retrieval key: `(project_id, work_unit_id)`
- stage output key: `(project_id, work_unit_id, stage_key, version)`
- log query key: `(project_id, work_unit_id, created_at desc)`

## 7.3 Isolation and compliance
- all rows include `project_id`,
- RLS enforces project membership access,
- no cross-project context assembly allowed,
- every run logs snapshot refs for replay/debug.

---

## Operational checklist (must-pass)

For each stage run:
- [ ] correct project resolved
- [ ] role prompt resolved
- [ ] role-specific memory resolved
- [ ] style/tone/reference slices attached
- [ ] required upstream outputs present
- [ ] output validated and persisted
- [ ] memory deltas persisted
- [ ] next stage enqueued (unless Director stop/failure)

If all checks pass, manual copy-paste baton passing is fully replaced.
