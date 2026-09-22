# Writers' Room OS — Role Prompt Management System

## Purpose

Define a project-scoped prompt management system so each role can run with:
- global default prompts,
- project-specific prompt overrides,
- role restrictions,
- output format rules,
- language rules,
without breaking orchestration reliability.

This system preserves non-negotiables:
- project separation,
- Korean-first default creative output,
- strict role boundaries,
- deterministic stage handoff,
- Director-gated revision control,
- explicit-request-only translation branch.

---

## 1) Prompt management model

## 1.1 Core entities

### `role_catalog`
Global role registry.

- `role_name` (pk)
  - `trend_strategist`
  - `story_architect`
  - `tone_style_director`
  - `continuity_manager`
  - `episode_writer`
  - `director`
  - `translator` (optional branch)
- `role_purpose` (text)
- `default_allowed_actions` (jsonb[])
- `default_forbidden_actions` (jsonb[])
- `default_output_schema_id` (fk)
- `default_language_policy` (jsonb)
- `created_at`, `updated_at`

### `prompt_templates`
Versioned default prompt templates per role.

- `id` (uuid)
- `role_name` (fk role_catalog)
- `template_type` (enum: system_prompt | style_guard | output_guard)
- `prompt_text` (text)
- `version` (int)
- `status` (enum: draft | active | deprecated)
- `changelog` (text)
- `created_by`, `created_at`

### `project_role_prompt_configs`
Project-scoped role prompt configuration.

- `id` (uuid)
- `project_id` (uuid)
- `role_name` (fk)
- `override_mode` (enum: none | append | replace | layered)
- `override_prompt_text` (text, nullable)
- `allowed_actions_override` (jsonb[])
- `forbidden_actions_override` (jsonb[])
- `output_schema_override_id` (fk, nullable)
- `language_rules_override` (jsonb, nullable)
- `restrictions_override` (jsonb, nullable)
- `is_active` (bool)
- `created_at`, `updated_at`

### `output_schemas`
Versioned structured output contracts.

- `id` (uuid)
- `role_name` (fk)
- `schema_json` (jsonschema)
- `version` (int)
- `status` (enum: active | deprecated)
- `created_at`

### `role_prompt_compilations`
Compiled runtime prompt artifact used by execution engine.

- `id` (uuid)
- `project_id` (uuid)
- `role_name` (fk)
- `compiled_prompt_text` (text)
- `effective_actions` (jsonb[])
- `effective_restrictions` (jsonb)
- `effective_output_schema_id` (fk)
- `effective_language_rules` (jsonb)
- `source_refs` (jsonb)  
  (default version ids + override config id)
- `compiled_at`

---

## 1.2 Required stored fields per role (as requested)

For every role in each project, store effective values for:
- role name
- role purpose
- system prompt
- project override prompt
- allowed actions
- forbidden actions
- expected output schema

Recommended representation:
- role purpose from `role_catalog`
- system prompt from active `prompt_templates`
- project override from `project_role_prompt_configs`
- final compiled state in `role_prompt_compilations`

---

## 2) How project-specific overrides work

## 2.1 Override modes

### `none`
- use default role templates only.

### `append`
- keep default prompt,
- append project-specific instructions at tail section.

### `replace`
- replace default system prompt with project prompt,
- still enforce mandatory safety/policy wrapper blocks.

### `layered` (recommended)
- compose default core prompt + immutable policy blocks + project override layer.
- best for preserving workflow integrity while allowing customization.

## 2.2 Scope of overrides

Project overrides may adjust:
- genre/tone-specific prompt phrasing,
- role emphasis per project objective,
- allowed/forbidden actions,
- output schema variant (if compatible),
- language behavior (still Korean-first for default creative flow).

Project overrides may NOT:
- remove role identity,
- bypass dependency rules,
- bypass Director gate,
- force translation into default creative chain,
- disable required output schema validation.

---

## 3) How default prompts and overrides combine

## 3.1 Prompt compilation order (deterministic)

At runtime for role `R` in project `P`:

1. Load active default prompt template(s) for `R`.
2. Load immutable policy block(s):
   - project isolation
   - Korean-first default
   - role boundary constraints
   - workflow compliance constraints
3. Load project override config for `R` (if active).
4. Merge by `override_mode`.
5. Merge action restrictions:
   - default allowed/forbidden
   - apply override deltas
   - resolve conflicts (forbidden wins)
6. Resolve effective output schema:
   - override schema if compatible,
   - else fallback to default schema.
7. Resolve effective language rules:
   - base language policy + project language policy + role override.
8. Emit `role_prompt_compilation` artifact.

## 3.2 Precedence rules

Highest -> lowest precedence:
1. hard platform/system policy constraints
2. project-level forbidden actions
3. project override prompt and settings
4. default role prompt templates

Conflict resolution:
- forbidden action overrides any allowed action.
- schema incompatibility blocks stage run until fixed.

---

## 4) Version history model

## 4.1 Versioning units

Version independently for:
- default prompt templates,
- project override configs,
- output schemas,
- compiled prompt artifacts.

## 4.2 History tables

### `prompt_change_log`
- `id`
- `project_id` (nullable for global defaults)
- `role_name`
- `entity_type` (template | override | schema | compilation)
- `entity_id`
- `from_version`
- `to_version`
- `change_summary`
- `changed_by`
- `created_at`

### `prompt_release_tags`
- `id`
- `project_id`
- `release_name` (e.g., `episode_21_cycle_2`)
- `role_prompt_compilation_ids` (uuid[])
- `created_at`

## 4.3 Rollback behavior

- Allow rollback to prior prompt or schema version per role.
- New workflow runs use rolled-back version.
- Existing stage runs keep historical refs for reproducibility.

---

## 5) Safe prompt adjustment UX (without breaking workflow)

## 5.1 Safe editing flow

1. User edits role prompt override in **Prompt Studio**.
2. System runs static validation checks.
3. System shows preview of effective compiled prompt.
4. System runs dry-run schema compatibility check.
5. User saves as draft version.
6. User publishes to active only after checks pass.

## 5.2 Validation checks (must-pass)

- required sections exist (role purpose, output contract instructions).
- banned directives absent (e.g., “ignore previous stage outputs”).
- output schema still valid and parsable.
- language policy compliance preserved.
- role boundary checks pass (e.g., Episode Writer prompt cannot grant Director approval authority).

## 5.3 Safety rails

- immutable guard block prepended in runtime compilation.
- forbidden actions cannot be removed if policy-critical.
- schema mismatch prevents activation.
- change requires reason note for audit.
- optional two-step publish (draft -> active) with Director/admin confirmation.

## 5.4 Recommended UI features

- side-by-side diff (default vs override vs effective prompt),
- lint warnings and policy violations panel,
- test run preview with sample context,
- “revert to previous stable version” button,
- per-role health status (safe / warning / blocked).

---

## Integration with workflow engine

Before each stage run, engine must use compiled role prompt artifact:

1. resolve `role_prompt_compilation` for (`project_id`, `role_name`),
2. assemble role-specific memory/context bundle,
3. execute stage with effective prompt + schema,
4. validate output against effective schema,
5. log compilation id used in stage run metadata.

This ensures project-specific customization without losing deterministic orchestration.

---

## Translation role note

Translator prompt config follows same model but is only invoked by explicit translation task requests.

- It may have project-specific localization overrides.
- It must preserve style/tone/voice identity per language policy.
- It is not compiled into default creative stage chain execution.
