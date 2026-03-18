# Writers' Room OS — Role-Specific Memory Retrieval System

## Purpose

Define how each role receives **only the memory it needs** (not one giant blob) while preserving continuity, project identity, and baton-passing workflow integrity.

This design preserves non-negotiables:
- project-scoped separation,
- Korean-first default creative output,
- strict role separation,
- sequential automatic handoff,
- Director-gated revision cycles,
- optional translator outside default pipeline.

---

## 1) Role-by-role memory retrieval map

## Shared memory taxonomy

- **PM**: Project Memory (identity/goals/style policy)
- **WB**: Work Bible Memory (canon, rules, timelines, character facts)
- **WM**: Working Memory (current work-unit state)
- **DM**: Decision Memory (approved/rejected directions)
- **RM**: Revision Memory (cycle issues + fixes)
- **RS**: Reference Slices (manuscript excerpts + style notes)
- **PSO**: Prior Stage Outputs

Each role has a distinct retrieval profile.

## 1.1 Trend Strategist

### Needs
- **PM**: high priority
  - audience, market, platform, commercial goal, work type
  - active tone/style summary (high-level only)
- **WM**: medium
  - current unit objective, unresolved commercial risks
- **PSO**: low-medium
  - prior Director strategy notes, previous trend outcome summary
- **RS**: low-medium
  - only market-positioning relevant excerpts (not prose-heavy samples)
- **DM**: high
  - accepted/rejected commercial directions
- **RM**: medium
  - recurrent strategy failures

### Should not be overloaded with
- full character sheet dump
- full canon timeline details
- low-level dialogue constraints
- full draft text unless strategy diagnostics require it

## 1.2 Story Architect

### Needs
- **PM**: high
  - project identity, genre conventions, pacing policy
- **WB**: high
  - structural rules, timeline anchors, theme constraints
- **WM**: high
  - current episode/chapter goal, unresolved tension map
- **PSO**: high
  - Trend Strategist output + previous architectural outputs
- **RS**: medium-high
  - structure-oriented reference excerpts (arc pacing, chapter transitions)
- **DM**: medium-high
  - prior approved/rejected structure decisions
- **RM**: medium-high
  - previous revision causes related to pacing/turning points

### Should not be overloaded with
- full stylistic micro-rules meant for sentence-level drafting
- all historical drafts
- irrelevant market micro-signals already resolved

## 1.3 Episode Writer

### Needs
- **PM**: high
  - style profile, tone profile, Korean-first language policy
- **WB**: high
  - character facts, world rules, continuity constraints
- **WM**: very high
  - current objective, emotional state, unresolved tension, pending notes
- **PSO**: very high
  - Story Architect output
  - Tone & Style output
  - Continuity output
- **RS**: very high
  - prose/dialogue exemplar excerpts
  - positive/negative style samples
- **DM**: medium-high
  - approved voice decisions and rejected writing directions
- **RM**: high
  - unresolved previous draft defects

### Should not be overloaded with
- full strategic analysis history
- full archive of old drafts across all units
- Director notes unrelated to current work unit

## 1.4 Tone & Style / Emotional Direction Writer

### Needs
- **PM**: very high
  - tone/style profile versions, emotional density rules, dialogue rules
- **WB**: medium
  - character relationship facts and theme constraints
- **WM**: high
  - current emotional state map, desired emotional arc this unit
- **PSO**: high
  - Story Architect output (especially beats)
- **RS**: very high
  - style/tone reference excerpts + manual style notes
- **DM**: high
  - approved/rejected tone decisions, voice rulings
- **RM**: high
  - prior style drift causes and unresolved emotional pacing issues

### Should not be overloaded with
- exhaustive continuity logs
- all market analytics raw data
- old structural branches already rejected

## 1.5 Worldbuilding / Continuity Manager

### Needs
- **PM**: medium-high
  - project identity constraints and core rules
- **WB**: very high
  - character sheets, world rules, timeline, forbidden inconsistencies
- **WM**: high
  - current unit events and unresolved continuity flags
- **PSO**: high
  - Story Architect output + Episode Writer draft snapshots
- **RS**: medium
  - reference excerpts tied to factual/canon consistency
- **DM**: medium-high
  - approved canon changes and rejected contradictions
- **RM**: very high
  - repeated continuity break patterns

### Should not be overloaded with
- stylistic ornamentation details beyond consistency relevance
- full commercial planning datasets
- irrelevant emotional micro-notes

## 1.6 Director

### Needs
- **PM**: very high
  - all project objectives and governance principles
- **WB**: high
  - canon-critical constraints summary
- **WM**: high
  - current unit status and unresolved blockers
- **PSO**: very high
  - all latest stage outputs and compliance reports
- **RS**: medium-high
  - key reference adherence summary + selected excerpts
- **DM**: very high
  - decision history for consistency and strategic coherence
- **RM**: very high
  - revision cycles, unresolved risks, repeat failures

### Should not be overloaded with
- full raw retrieval corpus
- low-value duplicate memories
- token-heavy raw chunks when summaries suffice

---

## 2) Recommended input bundles per role

Use compact, deterministic bundles with per-section token budgets.

## 2.1 Bundle schema

```json
{
  "bundle_id": "ctx_x",
  "project_id": "proj_x",
  "work_unit_id": "unit_x",
  "role": "story_architect",
  "language_policy": {
    "primary": "ko",
    "korean_first": true,
    "translation_explicit_request_only": true
  },
  "sections": {
    "project_identity": {"payload": {}, "priority": "high"},
    "canon_slice": {"payload": {}, "priority": "medium"},
    "working_slice": {"payload": {}, "priority": "high"},
    "prior_stage_slice": {"payload": {}, "priority": "high"},
    "reference_slice": {"payload": {}, "priority": "medium"},
    "decision_slice": {"payload": {}, "priority": "medium"},
    "revision_slice": {"payload": {}, "priority": "medium"}
  },
  "token_budget": {
    "max_total": 8000,
    "section_caps": {}
  },
  "snapshot_refs": {
    "project_memory": "pm_snap_12",
    "work_bible": "wb_snap_9",
    "decision_checkpoint": "dm_ck_44"
  }
}
```

## 2.2 Suggested section caps by role (relative)

- Trend Strategist: PM 30%, DM 20%, WM 15%, RS 15%, RM 10%, PSO 10%
- Story Architect: PSO 25%, WB 20%, WM 20%, PM 15%, RS 10%, DM 5%, RM 5%
- Episode Writer: PSO 30%, RS 20%, WM 20%, WB 15%, PM 10%, DM 3%, RM 2%
- Tone/Style Writer: PM 20%, RS 25%, PSO 20%, WM 15%, DM 10%, RM 10%
- Continuity Manager: WB 35%, PSO 20%, WM 15%, RM 15%, DM 10%, PM 5%
- Director: PSO 30%, DM 20%, RM 20%, PM 15%, WB 10%, WM 5%

(Percentages are starting defaults; tune per work type.)

---

## 3) Automatic assembly before each stage run

## 3.1 Assembly algorithm

For stage `S` and role `R`:

1. Resolve active project + work unit.
2. Load role retrieval profile (`retrieval_profiles` table/config).
3. Fetch memory candidates by layer, filtered by `project_id`.
4. Apply role filters (tags, relevance, recency, importance, unresolved flags).
5. Inject required prior stage outputs based on pipeline dependency graph.
6. Retrieve reference slice (`reference_role_views`) for role + work type.
7. Add Director critical notes (if pending).
8. Rank items by weighted score.
9. Trim to section caps and global token budget.
10. Produce immutable `role_context_bundle` with snapshot refs.
11. Log assembly metadata (`context_assembly_logs`).

## 3.2 Ranking function (recommended)

`score = w_role_relevance + w_importance + w_recency + w_unresolved + w_director_priority - w_redundancy`

Where:
- `w_role_relevance`: role-specific mapping strength
- `w_importance`: memory importance rank
- `w_recency`: freshness boost (except canonical WB)
- `w_unresolved`: if unresolved issue is still active
- `w_director_priority`: explicit director emphasis
- `w_redundancy`: penalty for duplicate semantic content

## 3.3 Required hard constraints

- hard filter by `project_id`
- translation memory excluded unless translation stage explicitly requested
- Korean-first language policy always included for creative stages
- canonical contradictions trigger blocking flags for continuity/director stages

---

## 4) Avoiding context overload while preserving continuity

## 4.1 Overload prevention techniques

1. **Layered summaries first, raw detail on demand**
   - provide concise summary objects before raw chunks.
2. **Section caps and budget enforcement**
   - each role has strict max tokens per section.
3. **Recency windows by layer**
   - e.g., WM last N stage updates, DM last M relevant decisions.
4. **Deduplication and compression**
   - cluster semantically similar items and keep representative item.
5. **Conflict-focused retrieval**
   - prioritize unresolved and director-flagged issues.
6. **Role-specific blacklists**
   - exclude known low-value memory categories per role.

## 4.2 Continuity preservation techniques

1. **Canonical pinning**
   - mandatory inclusion of key WB constraints.
2. **Decision anchors**
   - include top accepted/rejected decisions to avoid regressions.
3. **Revision anchors**
   - include unresolved revision reasons until resolved.
4. **Snapshot reproducibility**
   - store bundle refs so runs can be replayed and audited.
5. **Downstream baton integrity**
   - required PSO fields must be present or stage cannot start.

## 4.3 Suggested diagnostics

For each stage run, log:
- `context_size_tokens`
- `kept_items_count`
- `dropped_items_count`
- `top_dropped_reasons` (budget/redundancy/irrelevance)
- `continuity_risk_flag` (bool)
- `missing_dependency_flag` (bool)

Director panel should display these diagnostics for governance.

---

## Recommended implementation objects

- `retrieval_profiles` (role rules + weights + caps)
- `memory_items` (normalized memory records with tags/importance)
- `context_bundles` (materialized per-stage bundle)
- `context_assembly_logs` (audit)
- `dependency_rules` (required PSO fields per stage)

This supports deterministic orchestration now and advanced retrieval later (embedding/hybrid) without redesign.
