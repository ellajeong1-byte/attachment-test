# AI Writers' Room Operating System — Project Architecture

## 0) Non-negotiable product constraints

- The system is **project-centric** and supports multiple independent projects.
- Projects can be: webnovel, literary novel, essay collection, nonfiction book, narrative nonfiction, workbook, educational/scholarly writing.
- **Korean-first** by default for creative generation.
- Translator/Localization is **optional** and **outside** default creative pipeline.
- Translation runs **only on explicit user request**.
- Core workflow is **role-separated sequential baton passing** with Director review/revision loops.
- Persistent project memory is mandatory.

---

## 1) Ideal project data model

Below is a practical domain model that preserves strict project separation and workflow continuity.

## 1.1 Top-level entities

### `projects`
Core identity and scope boundary.

- `id` (uuid, pk)
- `owner_id` (uuid, fk auth/users)
- `title` (text)
- `work_type` (enum: webnovel | literary_novel | essay_collection | nonfiction_book | narrative_nonfiction | workbook | educational_scholarly)
- `genre` (text)
- `subgenre` (text)
- `target_audience` (text)
- `target_market` (text)
- `target_platform` (text)
- `commercial_goal` (text)
- `status` (enum: setup | active | paused | review | archived)
- `primary_writing_language` (default: `ko`)
- `ui_language` (default: `ko`)
- `created_at`, `updated_at`

### `project_language_settings`
Language and localization controls.

- `id` (uuid)
- `project_id` (uuid, fk projects)
- `translation_available` (bool)
- `translator_role_enabled` (bool)
- `translation_target_languages` (text[])
- `translation_explicit_request_only` (bool, default true)
- `default_translation_style` (text, optional)
- `created_at`, `updated_at`

### `project_style_profiles`
Style/tone identity guardrails.

- `id` (uuid)
- `project_id` (uuid)
- `tone_profile` (jsonb)
- `style_profile` (jsonb)
- `pov_rules` (jsonb)
- `pacing_rules` (jsonb)
- `forbidden_expressions` (text[])
- `genre_conventions` (jsonb)
- `emotional_density_rules` (jsonb)
- `dialogue_rules` (jsonb)
- `version` (int)
- `created_at`, `updated_at`

### `project_references`
Reference source registry.

- `id` (uuid)
- `project_id` (uuid)
- `type` (enum: manuscript | style_reference | excerpt | project_example)
- `title` (text)
- `storage_path` (text)
- `language` (text)
- `metadata` (jsonb)
- `created_at`

### `reference_chunks`
Chunked retrieval index for references.

- `id` (uuid)
- `project_id` (uuid)
- `reference_id` (uuid)
- `chunk_text` (text)
- `chunk_order` (int)
- `embedding_ref` (text or vector id)
- `tags` (text[])

---

## 1.2 Memory entities

### `project_memory`
Persistent project memory (stable long-term memory).

- `id` (uuid)
- `project_id` (uuid)
- `memory_key` (text)
- `memory_value` (jsonb)
- `source` (enum: user | role_output | director_decision | system)
- `importance` (smallint)
- `created_at`, `updated_at`

### `work_bible_memory`
Canonical world/argument bible (facts/rules that must remain consistent).

- `id` (uuid)
- `project_id` (uuid)
- `domain` (enum: worldbuilding | character | timeline | argument_framework | pedagogy_framework)
- `entry` (jsonb)
- `canonical` (bool)
- `created_at`, `updated_at`

### `working_memory`
Short-lived memory for active unit (episode/chapter/section).

- `id` (uuid)
- `project_id` (uuid)
- `work_unit_id` (uuid)
- `stage` (text)
- `payload` (jsonb)
- `expires_at` (timestamp)

### `decision_memory`
Decision log memory for governance and rationale.

- `id` (uuid)
- `project_id` (uuid)
- `decision_type` (enum: direction | quality | commercial | continuity | approval)
- `decision_payload` (jsonb)
- `decided_by` (text/uuid)
- `created_at`

### `revision_memory`
Revision-specific memory for loop traceability.

- `id` (uuid)
- `project_id` (uuid)
- `work_unit_id` (uuid)
- `cycle_number` (int)
- `target_stage` (text)
- `reason` (text)
- `resolution` (text)
- `created_at`, `resolved_at`

### `long_term_archive`
Frozen archive snapshots for historical continuity.

- `id` (uuid)
- `project_id` (uuid)
- `snapshot_type` (enum: monthly | milestone | publication)
- `snapshot_payload` (jsonb)
- `created_at`

---

## 1.3 Workflow entities

### `role_definitions`
Role catalog.

- `id` (uuid)
- `role_name` (enum: trend_strategist | story_architect | draft_writer | tone_style_director | continuity_manager | director | translator)
- `default_prompt` (text)
- `input_schema` (jsonschema)
- `output_schema` (jsonschema)

### `project_role_overrides`
Project-specific role prompt overrides.

- `id` (uuid)
- `project_id` (uuid)
- `role_name` (enum)
- `prompt_override` (text)
- `constraints` (jsonb)
- `updated_at`

### `pipeline_templates`
Reusable workflow template by work type.

- `id` (uuid)
- `work_type` (enum)
- `name` (text)
- `stages` (jsonb ordered list)
- `review_rules` (jsonb)

### `project_pipelines`
Active workflow configuration per project.

- `id` (uuid)
- `project_id` (uuid)
- `template_id` (uuid, nullable)
- `stages` (jsonb ordered)
- `enabled` (bool)
- `created_at`, `updated_at`

### `work_units`
Production unit (episode/chapter/section/essay module).

- `id` (uuid)
- `project_id` (uuid)
- `unit_type` (enum: episode | chapter | section | essay | module)
- `unit_number` (text/int)
- `title` (text)
- `status` (enum: not_started | ready | in_progress | completed | revision_requested | approved | rejected | blocked)
- `current_stage` (text)
- `revision_count` (int)
- `director_decision` (text)
- `created_at`, `updated_at`

### `stage_runs`
Each role execution instance.

- `id` (uuid)
- `project_id` (uuid)
- `work_unit_id` (uuid)
- `stage_name` (text)
- `role_name` (enum)
- `input_context_bundle` (jsonb)
- `output_payload` (jsonb)
- `status` (enum: queued | running | completed | failed | retried)
- `started_at`, `completed_at`
- `previous_stage_run_id` (uuid, nullable)

### `approval_rules`
Director gating rules.

- `id` (uuid)
- `project_id` (uuid)
- `rules` (jsonb)
- `updated_at`

### `review_events`
Director decisions and revision routing.

- `id` (uuid)
- `project_id` (uuid)
- `work_unit_id` (uuid)
- `decision` (enum: approve | conditional_approve | reject)
- `target_stage` (text, nullable)
- `reason` (text)
- `notes` (text)
- `created_at`

### `execution_logs`
Operational timeline log.

- `id` (uuid)
- `project_id` (uuid)
- `work_unit_id` (uuid)
- `event_type` (text)
- `event_payload` (jsonb)
- `created_at`

---

## 2) Project setup flow

## Step 1: Create project shell
- Input: title, work type, genre/subgenre, audience, market, platform, commercial goal, status.
- System creates strict project boundary (`project_id`).

## Step 2: Configure language policy
- Set primary writing language (default Korean).
- Set UI language.
- Configure translation policy:
  - translation available
  - translator role enabled
  - target languages
  - explicit request only (default true, locked recommended).

## Step 3: Define tone/style governance
- Fill tone profile and style profile.
- Add POV/pacing/dialogue/emotional-density rules.
- Add forbidden expressions and genre conventions.

## Step 4: Upload references
- Add manuscripts, style references, excerpts, examples.
- System chunks/indexes references for retrieval.

## Step 5: Initialize memory layers
- Seed project memory and work bible entries.
- Import existing notes into decision/revision memory if available.

## Step 6: Configure role prompts and workflow
- Set project-level overrides for each role prompt.
- Select or customize pipeline template.
- Define Director review and approval rules.

## Step 7: Create first work unit
- Create episode/chapter/section.
- Run pipeline from Trend Strategist to Director.
- Save every stage output + execution log + review events.

## Step 8: Optional translation request
- Translation runs only after explicit user request.
- Translator reads approved source + style identity and writes localized artifact.

---

## 3) Editable settings per project

## 3.1 Identity settings
- Title
- Work type
- Genre / subgenre
- Audience / market / platform
- Commercial goal
- Project status

## 3.2 Language settings
- Primary writing language (default Korean)
- UI language
- Translation available (on/off)
- Translator role enabled (on/off)
- Translation target languages
- Translation explicit-request-only policy (recommended immutable true)

## 3.3 Tone & style settings
- Tone profile
- Style profile
- POV rules
- Pacing rules
- Dialogue rules
- Emotional density rules
- Forbidden expressions
- Genre conventions

## 3.4 Reference settings
- Reference manuscript set
- Style reference files
- Representative excerpts
- Project examples
- Retrieval tags and priority weighting

## 3.5 Memory settings
- Project memory entries
- Work bible memory entries
- Working memory retention rules
- Decision memory visibility and lock rules
- Revision memory policy
- Long-term archive snapshot schedule

## 3.6 Workflow settings
- Role prompt overrides
- Pipeline stages and order
- Stage input/output schemas
- Retry/re-run policy
- Director review rules
- Approval states and routing policy

---

## 4) How project separation prevents style or memory contamination

## 4.1 Data-layer isolation
- Every table row is scoped by `project_id`.
- All queries require `project_id` filter.
- RLS policies enforce user/project membership and deny cross-project reads/writes.

## 4.2 Retrieval isolation
- Memory/references are indexed and queried only within active `project_id`.
- Embedding search must include mandatory project filter.
- No global memory retrieval for creative generation by default.

## 4.3 Prompt/context isolation
- Context assembly pipeline includes only:
  - active project config
  - active project memories
  - active project references
  - active work unit history
- Role prompt overrides are project-scoped.

## 4.4 Execution isolation
- Stage runs link to one `project_id` + one `work_unit_id`.
- Handoff artifacts are chained inside project boundary only.

## 4.5 Governance isolation
- Director decisions, revisions, and approval rules are project-local.
- Revision loops cannot route to stages outside the project pipeline.

## 4.6 Translation isolation
- Translator can access only source artifacts from active project.
- Translation is explicit-request branch, not ambient background process.

## 4.7 Operational safeguards
- UI must always display active project badge and lock context.
- Switching projects flushes cached working context and loads new project context bundle.
- Audit logs record project context id on every run.

---

## Recommended default pipeline (creative)

1. Data-driven Trend Strategist
2. Story Architect / Structure Writer
3. Tone & Style / Emotional Direction Writer
4. Worldbuilding / Continuity / Reference Manager
5. Episode / Draft Writer
6. Director

- Ends at Director checkpoint.
- Revision loop targets specific earlier stage.
- Translator/Localization remains optional branch on explicit request.
