# Writers' Room OS — Translator / Localization Role System

## Purpose

Define Translator / Localization as an **optional project staff role** that is:
- not part of default creative workflow,
- project-attached,
- triggered only by explicit user request,
- style/tone/voice preserving,
- auditable and version-linked to source outputs.

This role is translation-branch only and must never auto-run in the default writing pipeline.

---

## 1) Translator behavior

## 1.1 Role position in product

- Role type: `optional_staff_role`
- Default status: disabled unless attached to project
- Execution mode: explicit-request task only
- Pipeline membership: excluded from core creative stage chain

## 1.2 Behavioral principles

Translator must:
1. preserve project identity (voice, tone, pacing, style intent),
2. preserve character voice separation and narrative stance,
3. preserve audience/market framing intent,
4. preserve meaning over literal token-by-token conversion,
5. avoid introducing new facts not present in source,
6. produce target-language text suited to requested mode.

Translator must not:
- run automatically after Director approval,
- overwrite Korean source artifacts,
- alter core project memory directly,
- use cross-project references or memory.

## 1.3 Supported translation modes

- `direct_translation`
- `natural_translation`
- `localization`
- `pitch_style_adaptation`
- `synopsis_translation`
- `excerpt_translation`

Each request must include a declared `translation_mode`.

---

## 2) Translator inputs

Translator context bundle is project-scoped and source-linked.

## 2.1 Required inputs

1. **source outputs**
   - source artifact text
   - source artifact metadata (unit, stage, version)
2. **style profile**
   - active style profile version
   - key prose/dialogue/voice constraints
3. **tone profile**
   - core tone palette
   - emotional register and pacing constraints
4. **reference manuscripts**
   - translator-specific reference slices
   - representative positive/negative excerpts
5. **relevant project memory**
   - project identity memory
   - decision memory impacting tone/voice
   - revision memory if source has unresolved localization constraints
6. **audience and market goals**
   - target audience
   - target market/platform
   - commercial framing intent
7. **language policy and glossary**
   - allowed target language
   - localization preferences
   - glossary/term mapping rules

## 2.2 Optional inputs

- prior localization examples from same project
- target-market regulatory/style notes
- pitching-specific constraints (length, punchiness, CTA)

## 2.3 Input contract (example)

```json
{
  "project_id": "proj_x",
  "translation_task_id": "tr_101",
  "source_artifact_ref": "out_889:v3",
  "translation_mode": "localization",
  "target_language": "en",
  "context": {
    "style_profile_ref": "style_v4",
    "tone_profile_ref": "tone_v3",
    "reference_slice_ref": "ref_view_translator_v2",
    "memory_slice_ref": "mem_bundle_tr_101",
    "audience_market_ref": "aud_market_v1",
    "glossary_ref": "glossary_en_v5"
  }
}
```

---

## 3) Translation output types

## 3.1 Core output variants

- `full_project_translation`
- `unit_translation` (chapter/episode/section)
- `excerpt_translation`
- `synopsis_translation`
- `pitching_version`
- `localized_adaptation`

## 3.2 Output payload requirements

Every translator output should include:
- localized text
- mode used
- target language
- source artifact reference + source version
- fidelity/adaptation note
- unresolved localization questions (if any)
- alignment scores:
  - style alignment
  - tone alignment
  - voice alignment

## 3.3 Output contract (example)

```json
{
  "localized_artifact_id": "loc_880",
  "source_artifact_ref": "out_889:v3",
  "target_language": "en",
  "translation_mode": "pitch_style_adaptation",
  "localized_content": "...",
  "fidelity_report": {
    "preserved": ["tone", "voice", "hook cadence"],
    "adapted": ["idiomatic expression in ending line"]
  },
  "alignment": {
    "style_alignment_score": 0.91,
    "tone_alignment_score": 0.89,
    "voice_alignment_score": 0.93
  },
  "open_questions": []
}
```

---

## 4) Separate storage model for translated outputs

Translated outputs must be stored independently from Korean originals.

## 4.1 Storage principles

- source artifacts remain immutable and primary,
- localized artifacts are linked, not merged,
- every localized artifact references source version,
- source update invalidates downstream localization freshness.

## 4.2 Recommended entities

### `translation_tasks`
- task-level state and requested scope/mode

### `localized_artifacts`
- localized content + quality/fidelity metadata

### `localized_artifact_links`
- link table mapping source artifact/version to localized artifact/version

### `localization_review_events`
- optional review decisions for localized outputs

## 4.3 Example table fields

### `localized_artifacts`
- `id`
- `project_id`
- `translation_task_id`
- `source_artifact_id`
- `source_version`
- `target_language`
- `translation_mode`
- `content`
- `fidelity_report` (jsonb)
- `style_alignment_score`
- `tone_alignment_score`
- `voice_alignment_score`
- `status` (`draft` | `completed` | `review_pending` | `approved` | `rejected`)
- `stale_if_source_changes` (bool)
- `created_at`

### `localized_artifact_links`
- `id`
- `project_id`
- `source_artifact_id`
- `source_version`
- `localized_artifact_id`
- `target_language`
- `active`

---

## 5) How translation requests are triggered (UI + automation)

## 5.1 UI trigger model

Translation requests must be initiated from a separate optional panel (not default stage controls).

Allowed UI actions:
- Translate full project
- Translate chapter/episode
- Translate excerpt
- Localize synopsis
- Create English pitching version

Required form fields:
- request type / scope
- translation mode
- target language
- source selection
- optional audience-market target

On submit:
1. validate project language policy,
2. validate translator role enabled for project,
3. create `translation_tasks` row with `translation_requested` state,
4. enqueue Translation Task Engine.

## 5.2 Automation trigger model

Translation engine starts only when:
- explicit user request exists,
- request passes policy checks,
- source artifact exists and is accessible,
- target language is allowed.

Engine flow:
1. `translation_requested` -> `translation_queued`
2. context assembly -> `translation_context_ready`
3. translator execution -> `translation_in_progress`
4. output persist -> `translation_completed`
5. optional human review -> `localization_review_pending`

## 5.3 Guardrails

- no implicit translation triggers from writing workflow completion,
- no auto-injection of translation tasks into core stage graph,
- translation failure cannot mutate writing workflow states,
- translation logs remain separate but cross-linked via source artifact refs.

---

## Integration with core writing workflow

- Core workflow stops at Director review as usual.
- Translation is branch-only task execution.
- Translator can read project memory/style/tone/reference/source outputs/audience goals.
- Translator outputs remain separate artifacts and do not replace source Korean records.

This preserves Korean-first production while enabling controlled localization on demand.
