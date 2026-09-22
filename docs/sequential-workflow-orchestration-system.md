# Writers' Room OS — Sequential Workflow Orchestration System

## Purpose

Define the **mandatory automatic baton-passing engine** that replaces manual copy-paste between separate role chats.

This spec guarantees that for each project/work unit, the system will:
1. load correct project,
2. load project memory,
3. load role prompt,
4. load prior stage outputs,
5. merge context,
6. run stage,
7. save output,
8. pass output to next stage,
9. continue until Director Review.

This is the core product behavior.

---

## 1) Core sequential workflow contract

Default creative chain:
1. Trend Strategist
2. Story Architect
3. Tone & Style / Emotional Direction
4. Worldbuilding / Continuity Manager
5. Episode Writer
6. Director Review

Global rules:
- project-scoped isolation is strict,
- Korean-first output is default for creative stages,
- translation is optional and explicit-request-only,
- each stage has a structured input/output contract,
- each run is persisted and auditable,
- memory updates happen after each stage,
- revision loops route to targeted earlier stage.

---

## 2) Orchestration state model

## 2.1 Work unit state

```json
{
  "work_unit_id": "unit_21",
  "project_id": "proj_crimson_oath",
  "pipeline_id": "pipe_default_v1",
  "status": "ready | running | awaiting_director | revision_requested | approved | rejected | failed",
  "current_stage": "trend_strategy",
  "next_stage": "story_architect",
  "revision_cycle": 0,
  "last_run_id": "run_101",
  "created_at": "",
  "updated_at": ""
}
```

## 2.2 Stage run state

```json
{
  "stage_run_id": "run_101",
  "project_id": "proj_x",
  "work_unit_id": "unit_x",
  "stage": "story_architect",
  "status": "queued | context_ready | running | completed | failed | blocked",
  "input_bundle_ref": "ctx_22",
  "output_ref": "out_22",
  "memory_update_ref": "mem_upd_22",
  "started_at": "",
  "completed_at": "",
  "error": null
}
```

---

## 3) Automatic baton-passing algorithm

## 3.1 End-to-end loop

For active work unit `W`:

1. Resolve active project + pipeline + stage order.
2. Determine current stage `S`.
3. Build role context bundle for `S`:
   - role prompt (+ project override)
   - project memory slice
   - style/tone profile slice
   - reference manuscript slice
   - prior stage outputs (required dependencies)
   - relevant decision/revision memory
4. Validate context completeness.
5. Execute role `S`.
6. Validate role output schema.
7. Persist output artifact.
8. Update memory layers (working + decision + bible + revision where applicable).
9. Determine next stage `S+1`.
10. If `S+1` exists and no blocking condition, enqueue and auto-run `S+1`.
11. If `S == Director`, stop and set review decision state.

## 3.2 Pseudocode

```text
while work_unit.status in {ready, running, revision_requested}:
  S = resolve_current_stage(work_unit)
  ctx = assemble_context(project_id, work_unit_id, S)
  assert ctx.is_valid

  run = execute_stage(S, ctx)
  assert run.output_schema_valid

  save_output(run.output)
  mem_delta = update_memory_layers(run.output, S)
  persist(mem_delta)

  if S == director:
    set_status(awaiting_director_or_final)
    break

  next = determine_next_stage(S, pipeline)
  set_current_stage(next)
  enqueue(next)
```

---

## 4) Stage input contracts (minimum required)

Every stage input must include:
- `project_identity` (title, work type, audience, goals)
- `language_policy` (Korean-first defaults)
- `active_style_profile`
- `active_tone_profile`
- `role_prompt`
- `required_prior_outputs`
- `project_memory_slice`
- `work_bible_slice`
- `working_memory_slice`
- `decision/revision slice`
- `reference_slice`

Missing required fields => stage status `blocked` with diagnostic reason.

---

## 5) Stage output contracts and persistence

For each stage run, store:
- raw output payload (json/text)
- structured summary
- confidence/risk flags
- dependency IDs used
- profile versions used
- memory update delta IDs

Recommended entities:
- `stage_runs`
- `stage_outputs`
- `context_bundles`
- `memory_deltas`
- `execution_logs`

Persistence guarantees:
- outputs are immutable by version,
- reruns create new version, do not overwrite previous,
- every output links to stage + work unit + project.

---

## 6) Memory update policy after each stage

After successful stage completion:

1. Always update **Working Memory** summary for next stage.
2. If stable decision introduced, write to **Decision Memory**.
3. If canon rule changed (and approved path), update **Work Bible Memory**.
4. If revision-related issue observed, append **Revision Memory** entry.
5. Archive snapshot into **Long-term Archive**.

Promotion rule:
- transient notes remain in working memory until Director-approved.

---

## 7) Next-stage determination and dependency checks

## 7.1 Next-stage resolution

- default by pipeline order,
- if revision request exists, route to `target_stage` from Director decision,
- downstream stages after target must be marked stale and queued for rerun.

## 7.2 Dependency graph enforcement

Each stage declares required upstream outputs, e.g.:
- Story Architect requires Trend output,
- Tone/Style requires Story output,
- Continuity requires Story + Tone outputs,
- Episode Writer requires Story + Tone + Continuity outputs,
- Director requires all latest outputs + diagnostics.

Missing dependency => `blocked` + actionable message.

---

## 8) Director Review behavior

Director stage receives:
- all latest stage outputs,
- style/tone/reference adherence diagnostics,
- continuity and risk flags,
- decision/revision history summary.

Director actions:
- `approve`: finalize current cycle.
- `conditional_approve`: set target stage + required changes.
- `reject`: set target stage + blocking revision reason.

On conditional/reject:
- create revision cycle entry,
- preserve previous outputs,
- reroute orchestration to target stage,
- auto-run chain forward again until Director.

---

## 9) Context assembly for role-specific memory injection

Before each stage run, context assembly service must:
1. fetch role retrieval profile,
2. fetch memory candidates by layer with project filter,
3. rank by role relevance, importance, unresolved flags,
4. apply section caps to avoid overload,
5. inject required prior outputs,
6. attach style/tone + reference slices,
7. emit immutable `context_bundle` with snapshot refs.

This is what makes the project feel like ongoing learning without fine-tuning.

---

## 10) Avoiding overload while preserving continuity

Mechanisms:
- role-specific token budgets per memory section,
- layered summaries first, raw details only when needed,
- deduplication and contradiction highlighting,
- mandatory inclusion of canon and top decision/revision anchors,
- stale output and missing dependency flags.

System diagnostics per stage:
- context size tokens,
- memory items kept/dropped,
- dropped reasons,
- continuity risk flag,
- unresolved revision carryover flag.

---

## 11) Translation branch policy integration

Translation is not part of default creative chain.

Trigger:
- explicit request only (e.g., “Translate this chapter into English”).

Translator stage receives:
- source approved artifact,
- project memory,
- style/tone profiles,
- reference slices,
- relevant decision/revision memory,
- glossary + localization preferences.

Outputs are stored as localized artifacts linked to source; source Korean artifacts remain primary and unchanged.

---

## 12) Implementation-ready service boundaries

- **Pipeline Orchestrator**: stage scheduling + transitions + retries.
- **Context Builder**: role-specific bundle assembly.
- **Memory Updater**: memory delta writes and promotion rules.
- **Output Store**: immutable stage outputs + versions.
- **Director Gatekeeper**: decision handling and revision routing.
- **Diagnostics Service**: compliance, risk, overload metrics.

This separation keeps the workflow deterministic and auditable.

---

## 13) Minimum viable execution checklist

For each stage run, confirm:
- [ ] active project resolved
- [ ] memory bundle built (role-specific)
- [ ] required upstream outputs present
- [ ] role prompt + override loaded
- [ ] style/tone/reference attached
- [ ] output persisted
- [ ] memory updated
- [ ] next stage enqueued automatically (unless Director/failure)

If all checks pass repeatedly, manual baton-passing is fully replaced.
