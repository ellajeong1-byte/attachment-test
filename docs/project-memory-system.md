# Writers' Room OS — Project Memory System

## Purpose

Design a multi-layer project memory system so each AI role behaves like an ongoing creative team with continuity over time, not stateless one-off generation.

This system is:
- project-scoped (strict separation),
- Korean-first for creative output,
- role-aware in retrieval,
- workflow-coupled (updated each stage),
- Director-governed through revision memory,
- compatible with optional explicit-request translation.

---

## 1) Memory layers

The memory architecture is a layered stack with different durability and access semantics.

## Layer A — Project Memory (identity memory)
**Durability:** very long-term (persistent)
**Role:** defines stable project identity and policy

## Layer B — Story / Work Bible Memory (canonical rules)
**Durability:** long-term (persistent, high integrity)
**Role:** canon and structural truth source

## Layer C — Working Memory (task-state memory)
**Durability:** short-term (work-unit scoped)
**Role:** current episode/chapter context and active tensions

## Layer D — Decision Memory (governance memory)
**Durability:** long-term (persistent)
**Role:** records accepted/rejected directions and rationale

## Layer E — Revision Memory (change-loop memory)
**Durability:** long-term (persistent, cycle-bound)
**Role:** tracks why rework happened and how it was resolved

## Layer F — Long-term Archive (historical artifacts)
**Durability:** immutable historical snapshots
**Role:** complete trace of drafts, runs, and prior states

---

## 2) What belongs in each layer

## 2.1 Project Memory
Project identity and strategic constants.

Include:
- genre
- tone profile (active version)
- style profile (active version)
- audience definition
- project goals / commercial goals
- core creative rules
- reference style summary
- director principles
- language policy (Korean-first, translation explicit-request-only)

Suggested object:
```json
{
  "project_id": "proj_x",
  "identity": {
    "genre": "...",
    "work_type": "...",
    "audience": "...",
    "goals": ["..."],
    "director_principles": ["..."]
  },
  "style_tone": {
    "style_profile_version": 4,
    "tone_profile_version": 3,
    "core_rules": ["..."]
  },
  "reference_signature": {
    "summary_version": 2,
    "key_style_markers": ["..."]
  },
  "language_policy": {
    "primary": "ko",
    "translation_explicit_request_only": true
  }
}
```

## 2.2 Story / Work Bible Memory
Canon and consistency constraints.

Include:
- character sheets
- worldbuilding rules
- concept notes
- theme rules
- forbidden inconsistencies
- structural rules (arc/chapter logic)
- timeline anchors

Principle:
- treated as canonical truth unless explicitly changed by approved decision.

## 2.3 Working Memory
Current active unit context.

Include:
- current episode/chapter goal
- previous output summary
- current emotional state map
- unresolved tension
- pending director notes
- active stage and blockers

Lifecycle:
- created when work unit starts,
- refreshed each stage,
- partially promoted to other layers when approved.

## 2.4 Decision Memory
Team-level decisions and direction shifts.

Include:
- approved changes
- rejected directions
- tone decisions
- character voice decisions
- commercial strategy adjustments
- decision owner/date/rationale

Use:
- role prompts should consume this to avoid repeating rejected ideas.

## 2.5 Revision Memory
Revision-loop intelligence.

Include:
- why revision was requested
- which stage caused problem
- director request text
- what changed to resolve it
- before/after delta summary
- cycle number

Use:
- prevents recurring mistakes across cycles.

## 2.6 Long-term Archive
Historical provenance and reproducibility.

Include:
- past drafts
- past stage outputs
- previous project state snapshots
- style samples over time
- execution logs and review events
- profile versions used per run

Use:
- backtesting, audits, style drift analysis, and future retrieval training data.

---

## 3) How memory persists by project

## 3.1 Persistence model
Every memory row carries `project_id` and (where relevant) `work_unit_id`.

Recommended tables:
- `project_memory`
- `work_bible_memory`
- `working_memory`
- `decision_memory`
- `revision_memory`
- `long_term_archive`

## 3.2 Project isolation rules
- RLS: user must be member/owner of project.
- Hard query guard: retrieval requires active `project_id`.
- Cache isolation: switching project flushes memory cache and context bundle.
- No cross-project fallback retrieval in creative pipeline.

## 3.3 Versioning
- style/tone and key policy memory are versioned.
- each stage run stores memory snapshot references:
  - `project_memory_snapshot_id`
  - `work_bible_snapshot_id`
  - `decision_memory_checkpoint`

This guarantees reproducibility and debugging.

---

## 4) How memory updates after each workflow stage

Default creative pipeline:
1. Trend Strategist
2. Story Architect
3. Tone & Style / Emotional Direction
4. Worldbuilding / Continuity / Reference Manager
5. Episode / Draft Writer
6. Director

## 4.1 Stage update protocol (generic)
After each stage completion:

1. Validate stage output schema.
2. Write raw output to archive (`long_term_archive` + stage output store).
3. Update working memory summary for next stage.
4. If output introduces stable decisions, write to decision memory.
5. If canon-affecting changes approved, update work bible memory.
6. Append execution log event with memory update references.

## 4.2 Role-specific update examples

### Trend Strategist completion
- Update working memory: market focus + risk flags.
- Update decision memory: commercial direction adjustments (if accepted).

### Story Architect completion
- Update working memory: episode/chapter objective and structure map.
- Update work bible memory: structural constraints if canonized.

### Tone & Style completion
- Update working memory: emotional pacing directives.
- Update decision memory: approved voice/tone handling decisions.

### Continuity completion
- Update work bible memory: corrected canon notes.
- Update working memory: active inconsistency blockers.

### Draft Writer completion
- Archive draft artifact + stage output.
- Update working memory: unresolved writing notes.

### Director completion
- On approve:
  - promote accepted working memory facts to decision/bible memory.
- On conditional/reject:
  - write revision memory entry,
  - set targeted stage and required deltas in working memory.

## 4.3 Promotion rules (important)
Not all working memory should become persistent memory.

Promotion criteria:
- approved by Director,
- repeated across cycles,
- canon impact,
- strategic impact,
- style policy impact.

---

## 5) How memory supports more intelligent retrieval later

## 5.1 Retrieval-ready design now
Store memory with metadata:
- `memory_type`
- `importance`
- `recency`
- `role_relevance`
- `tags` (tone, character, pacing, platform, etc.)
- `confidence`
- `source_stage`

This enables retrieval ranking without schema redesign.

## 5.2 Role-specific retrieval bundles
At run-time, build `role_context_bundle`:

- `project_identity_slice` (Project Memory)
- `canon_slice` (Work Bible)
- `task_slice` (Working Memory)
- `decision_slice` (Decision Memory)
- `revision_slice` (Revision Memory)
- `reference_slice` (Reference Manuscript System)

Each role gets different weights and filters.

## 5.3 Retrieval ranking strategy (future)
Weighted hybrid ranking:

`score = w1*role_relevance + w2*importance + w3*recency + w4*decision_priority + w5*revision_risk`

Later add vector search over memory text/chunks with mandatory project filter.

## 5.4 Drift prevention
Use memory-aware checks:
- style/tone drift detector against active profile,
- canon contradiction detector against work bible,
- rejected-direction detector against decision memory,
- unresolved-issue checker against revision memory.

Results are shown to Director as pre-review diagnostics.

---

## Operational lifecycle summary

For each stage run:
1. load project-scoped memory layers,
2. assemble role-specific context bundle,
3. execute role,
4. persist output + logs,
5. update working memory,
6. selectively promote into decision/bible memory,
7. archive artifacts,
8. continue baton pass until Director.

Translation branch (explicit request only):
- translator reads same project memory + references,
- preserves source voice/tone identity in target language,
- writes localization decisions into decision/revision memory when applicable.

---

## Suggested UI components

- **Memory Dashboard**: layer overview with freshness/status.
- **Memory Inspector**: inspect entries by layer, source stage, and role relevance.
- **Promotion Queue**: approve/reject working-memory promotion into persistent layers.
- **Revision Intelligence Panel**: unresolved issues and recurrence patterns.
- **Memory Diff Viewer**: compare memory checkpoints between revision cycles.
- **Role Context Preview**: preview exact memory bundle each role receives.
