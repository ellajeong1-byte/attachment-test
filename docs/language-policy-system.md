# Writers' Room OS — Language Policy System

## Purpose

Define a Korean-first language policy that preserves project identity while supporting explicit, optional translation workflows.

This policy enforces:
- Korean as default primary creative language,
- Korean-first as system default (not Korean-only),
- translation outside default creative pipeline,
- explicit user-triggered Translator/Localization execution,
- voice/style/tone/pacing preservation in localized outputs,
- strict project-scoped memory/reference access.

---

## 1) Ideal language configuration model

## 1.1 Language policy object (project-scoped)

```json
{
  "project_id": "proj_x",
  "language_policy_version": 1,
  "primary_writing_language": "ko",
  "ui_language": "ko",
  "korean_first": true,
  "korean_only": false,
  "translation": {
    "enabled": true,
    "translator_role_enabled": true,
    "explicit_request_only": true,
    "default_target_languages": ["en"],
    "allowed_target_languages": ["en", "ja", "zh", "es"],
    "auto_translate_after_approval": false,
    "preserve_style_tone_voice": true,
    "preserve_pacing_identity": true
  },
  "localization_preferences": {
    "register": "neutral | formal | market_specific",
    "proper_noun_policy": "transliterate | localized_alias | mixed",
    "glossary_mode": "strict | advisory",
    "cultural_adaptation_level": "minimal | moderate | explicit"
  },
  "compliance_rules": {
    "translator_requires_memory_access": true,
    "translator_requires_reference_access": true,
    "translator_requires_source_output_link": true
  },
  "created_at": "",
  "updated_at": ""
}
```

## 1.2 Relational model (recommended)

### `project_language_settings`
- `id` (uuid)
- `project_id` (uuid)
- `primary_writing_language` (text, default `ko`)
- `ui_language` (text, default `ko`)
- `korean_first` (bool, default true)
- `korean_only` (bool, default false)
- `translation_enabled` (bool)
- `translator_role_enabled` (bool)
- `translation_explicit_request_only` (bool, default true)
- `default_target_languages` (text[])
- `allowed_target_languages` (text[])
- `auto_translate_after_approval` (bool, default false)
- `created_at`, `updated_at`

### `translation_requests`
- `id` (uuid)
- `project_id` (uuid)
- `work_unit_id` (uuid, nullable for project-level request)
- `source_artifact_id` (uuid)
- `request_scope` (enum: project | work_unit | artifact | synopsis)
- `target_language` (text)
- `request_prompt` (text)
- `status` (enum: queued | running | completed | failed | canceled)
- `requested_by` (uuid)
- `requested_at`, `completed_at`

### `localized_artifacts`
- `id` (uuid)
- `project_id` (uuid)
- `source_artifact_id` (uuid)
- `translation_request_id` (uuid)
- `target_language` (text)
- `localized_content` (text/jsonb)
- `fidelity_report` (jsonb)
- `style_alignment_score` (numeric)
- `tone_alignment_score` (numeric)
- `voice_alignment_score` (numeric)
- `created_at`

### `translation_glossary`
- `id` (uuid)
- `project_id` (uuid)
- `source_term` (text)
- `target_language` (text)
- `target_term` (text)
- `term_type` (enum: character | world | technical | brand | stylistic)
- `strict` (bool)

---

## 2) Project-level language settings

Each project must own independent language settings.

## 2.1 Required settings
- primary writing language (default `ko`)
- UI language
- Korean-first toggle (default `true`)
- Korean-only toggle (default `false`)
- translation enabled toggle
- translator role enabled toggle
- explicit-request-only (default `true`, recommended locked)
- allowed target languages
- default translation target(s)

## 2.2 Recommended admin controls
- “Use Korean-first creative defaults” preset.
- “Translation disabled for this project” option.
- “Require Director approval before translation request runs” option.
- “Enforce glossary” option per target language.

## 2.3 Validation rules
- If `korean_first=true`, default creative stages must output Korean unless user override is explicit.
- If `translation_explicit_request_only=true`, translation cannot run from automated pipeline triggers.
- If target language not in `allowed_target_languages`, request is rejected.

---

## 3) Task-level translation request behavior

Translation is a separate branch, never default creative stage.

## 3.1 Explicit request detection

The translator can run only when request intent is explicit, e.g.:
- “Translate this project into English”
- “Translate this chapter into English”
- “Create an English-localized version of this essay”
- “Translate this synopsis for international pitching”

System behavior:
1. Parse user intent as translation request.
2. Resolve scope (`project`, `work_unit`, `artifact`, `synopsis`).
3. Validate policy and permissions.
4. Create `translation_requests` row.
5. Run Translator role with source-linked context bundle.

## 3.2 Scope-specific behavior

### Project scope
- translate selected approved artifacts across project scope (batch mode).

### Work-unit scope
- translate one chapter/episode/module and linked synopsis/metadata as requested.

### Artifact scope
- translate single source artifact only.

### Synopsis scope
- translate summary-oriented artifacts for pitching or marketing use.

## 3.3 Guardrails
- never mutate original Korean artifact.
- always link localized output to source artifact id + source version.
- if source artifact is revised later, mark translation as stale.

---

## 4) How the Translator role should behave

## 4.1 Translator role contract

### Inputs required
- source artifact content + metadata
- project memory slice (identity, goals, director principles)
- style profile and tone profile (active versions)
- reference manuscript role slice
- decision/revision memory relevant to voice constraints
- glossary and naming policies

### Output required
- localized text in target language
- fidelity report (what was preserved/adapted)
- unresolved localization questions
- alignment scores (style/tone/voice)

## 4.2 Translator behavior principles
- preserve narrative identity over literal word-by-word translation.
- preserve emotional pacing and tonal register.
- preserve character voice separation.
- preserve structural emphasis and hook timing.
- avoid introducing new story facts.
- respect Korean-source nuance and culturally sensitive elements.

## 4.3 What translator should not do
- should not run in default pipeline.
- should not override project style/tone policy.
- should not rewrite source intent for creative divergence.
- should not access cross-project memory/reference data.

---

## 5) How translated outputs are stored separately from Korean originals

## 5.1 Storage architecture

Keep original and localized artifacts as separate immutable records.

### Source artifact record (`artifacts`)
- `id`
- `project_id`
- `work_unit_id`
- `language='ko'`
- `content`
- `version`
- `is_source=true`

### Localized artifact record (`localized_artifacts`)
- `id`
- `project_id`
- `source_artifact_id`
- `language='en'` (or target)
- `localized_content`
- `translation_request_id`
- `source_version`
- `stale_if_source_changes` (bool)

## 5.2 Traceability and audit
- every localized artifact stores source linkage + policy version + profile versions.
- translation run logs include bundle refs for reproducibility.
- Director can review localized outputs separately without affecting source approval state.

## 5.3 UI behavior
- Korean source remains primary in production workspace.
- “Localized Versions” tab shows language variants.
- stale badge appears when Korean source has newer version than localization.
- compare view: source vs localized text + fidelity notes.

---

## Integration into the workflow engine

Default creative pipeline remains:
1. Trend Strategist
2. Story Architect
3. Tone & Style / Emotional Direction
4. Continuity Manager
5. Episode Writer
6. Director

Translation branch (optional):
- starts only via explicit user request,
- loads translator context bundle from same project memory/reference system,
- outputs stored in `localized_artifacts`,
- does not alter the source Korean artifact lifecycle.
