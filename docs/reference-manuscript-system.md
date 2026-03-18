# Writers' Room OS — Reference Manuscript System

## Purpose

Design a project-scoped reference manuscript system that enables style adaptation **without initial fine-tuning**.

The system lets an author attach prior writing assets (novels, essays, nonfiction manuscripts, excerpts, voice notes) to a specific project so roles can consume the right reference slices during sequential workflow execution.

It preserves core constraints:
- strict project separation,
- Korean-first default creative output,
- role-separated pipeline,
- Director-gated revisions,
- optional translation role (explicit request only) using the same reference system.

---

## 1) Reference manuscript data model

## 1.1 Core entities

### `project_references`
Top-level reference file registry (already aligned with project architecture).

- `id` (uuid, pk)
- `project_id` (uuid, fk projects)
- `reference_type` (enum):
  - `previous_novel`
  - `essay_book`
  - `nonfiction_manuscript`
  - `long_form_sample`
  - `representative_excerpt_set`
  - `voice_note`
  - `style_guide`
- `title` (text)
- `author_label` (text, optional)
- `source_language` (text, default `ko`)
- `storage_path` (text)
- `file_format` (enum: pdf | docx | md | txt | epub)
- `copyright_scope` (enum: own_work | licensed | restricted)
- `usage_policy` (jsonb): allowed roles, allowed stages, blocked usages
- `quality_score` (numeric, optional)
- `active` (bool)
- `created_at`, `updated_at`

### `reference_excerpts`
Manually curated “gold standard” passages.

- `id` (uuid)
- `project_id` (uuid)
- `reference_id` (uuid)
- `label` (text) e.g., `romance_tension_dialogue`, `essay_closing_cadence`
- `excerpt_text` (text)
- `intent_tags` (text[]) e.g., `tone:warm`, `dialogue:subtext`, `pace:slow_burn`
- `positive_or_negative` (enum: positive | negative)
- `priority_weight` (int)
- `created_by` (uuid)
- `created_at`

### `reference_style_notes`
Manual style annotations from author/editor.

- `id` (uuid)
- `project_id` (uuid)
- `reference_id` (uuid, nullable if project-level)
- `note_type` (enum):
  - narrator_voice
  - dialogue_principle
  - emotional_restraint
  - pacing
  - sentence_rhythm
  - forbidden_pattern
  - translation_preservation
- `note_text` (text)
- `severity` (enum: hint | strong_rule | hard_constraint)
- `applies_to_roles` (text[])
- `created_at`, `updated_at`

### `reference_auto_summaries`
Machine-generated style/tone summaries for operational use.

- `id` (uuid)
- `project_id` (uuid)
- `reference_id` (uuid)
- `summary_version` (int)
- `style_signature` (jsonb)
- `tone_signature` (jsonb)
- `voice_signature` (jsonb)
- `structure_signature` (jsonb)
- `dialogue_signature` (jsonb)
- `korean_naturalness_signature` (jsonb)
- `confidence` (numeric)
- `generated_at`

### `reference_role_views`
Role-specific precomputed slices for fast context assembly.

- `id` (uuid)
- `project_id` (uuid)
- `role_name` (enum)
- `work_type` (enum)
- `slice_payload` (jsonb)
- `source_reference_ids` (uuid[])
- `version` (int)
- `updated_at`

---

## 1.2 Optional retrieval-ready entities (future-proof)

### `reference_chunks`
Chunked passages for semantic retrieval.

- `id` (uuid)
- `project_id` (uuid)
- `reference_id` (uuid)
- `chunk_text` (text)
- `chunk_index` (int)
- `tags` (text[])
- `embedding_vector` (vector/nullable for now)
- `token_count` (int)

### `reference_query_logs`
Audit of retrieval usage.

- `id` (uuid)
- `project_id` (uuid)
- `role_name` (enum)
- `query_intent` (text)
- `retrieved_chunk_ids` (uuid[])
- `work_unit_id` (uuid)
- `created_at`

---

## 2) How files are attached to projects

## 2.1 Attachment flow

1. User opens project → **References**.
2. Upload file(s) with metadata:
   - reference_type,
   - source_language,
   - intended usage (tone/dialogue/structure/etc.),
   - allowed roles.
3. System stores file under project-scoped storage path:
   - `projects/{project_id}/references/{reference_id}/...`
4. System creates `project_references` row and marks `active=true`.
5. User optionally creates manual `reference_excerpts` and `reference_style_notes`.
6. System runs asynchronous parsing + auto-summary pipeline.

## 2.2 Project isolation guardrails

- References are always keyed by `project_id`.
- RLS prevents cross-project read/write.
- Context builder rejects references whose `project_id` != active project.
- On project switch, all reference caches are invalidated and rebuilt.

---

## 3) How style reference is summarized into usable guidance

## 3.1 Auto-summary pipeline

For each active reference file:

1. **Parse & normalize**
   - extract text and section boundaries
   - detect language
   - segment narrative/dialogue/expository zones

2. **Feature extraction**
   - sentence length distribution
   - paragraph cadence
   - dialogue ratio
   - direct vs indirect emotion markers
   - lexical register and diction patterns
   - Korean naturalness markers (connectors/endings/honorific patterns)

3. **Signature generation**
   - style_signature
   - tone_signature
   - voice_signature
   - structure_signature
   - dialogue_signature

4. **Guidance synthesis**
   - produce “do”/“avoid” rules
   - map to project style/tone profile fields
   - emit confidence and ambiguity notes

5. **Role-slice compilation**
   - generate role-specific payloads in `reference_role_views`

## 3.2 Usable guidance format

A role-ready guidance bundle should include:

- `reference_objective`
- `top_style_rules` (max 8)
- `top_tone_rules` (max 8)
- `forbidden_patterns`
- `positive_excerpt_ids`
- `negative_excerpt_ids`
- `korean_naturalness_checks`
- `confidence_notes`

This avoids dumping raw long text and supports deterministic prompt assembly.

---

## 4) How different roles consume different slices

Role separation remains strict.

## 4.1 Trend Strategist
Consumes:
- high-level tone/style positioning summary,
- market compatibility hints from references.

Uses:
- validate whether stylistic identity supports target market/platform.

## 4.2 Story Architect
Consumes:
- structure_signature,
- pacing and progression cues,
- long-form organization patterns.

Uses:
- derive chapter/episode architecture and hook cadence.

## 4.3 Tone & Style / Emotional Direction Writer
Consumes:
- full style_signature + tone_signature + voice notes,
- positive/negative excerpts for emotional control.

Uses:
- convert profile + references into precise style constraints for draft stage.

## 4.4 Continuity / Reference Manager
Consumes:
- canonical reference constraints,
- contradiction-sensitive notes,
- forbidden pattern list.

Uses:
- detect style drift and factual/reference conflicts.

## 4.5 Episode / Draft Writer
Consumes:
- distilled prose and dialogue rules,
- selected exemplar excerpts,
- Korean-first naturalness rules.

Uses:
- generate readable draft aligned with project identity.

## 4.6 Director
Consumes:
- deviation reports against style/tone signatures,
- summary of adherence to reference constraints.

Uses:
- approval/conditional/reject with targeted revision routing.

## 4.7 Translator / Localization Editor (optional)
Consumes:
- same project references,
- source output + style/tone signatures,
- translation preservation notes.

Uses:
- preserve voice identity in target language when explicitly requested.

---

## 5) How this works before fine-tuning

No fine-tuning required initially.

## 5.1 Core mechanism

- Retrieval + structured prompt injection + validation:
  1. assemble role-specific reference slice,
  2. combine with project style/tone profile,
  3. combine with memory + prior stage outputs,
  4. run role,
  5. score adherence and log deviations.

## 5.2 Why effective

- Project-specific adaptation without retraining cycles.
- Fast updates: author edits notes/excerpts and next run reflects changes.
- Traceability: each stage run records which references and profile versions were applied.

## 5.3 Compliance scoring (recommended)

For each stage output, compute:
- `style_alignment_score`
- `tone_alignment_score`
- `voice_consistency_score`
- `korean_naturalness_score`
- `reference_usage_confidence`

Scores feed Director review and revision targeting.

---

## 6) How future retrieval/search can be added later

## 6.1 Phase 1 (current)
- Metadata and curated excerpt selection.
- Precomputed role slices (`reference_role_views`).

## 6.2 Phase 2
- Chunking + embeddings (`reference_chunks`).
- Semantic retrieval with mandatory project filter.
- Query-intent routing (dialogue/tone/structure/fact checks).

## 6.3 Phase 3
- Hybrid retrieval:
  - metadata filter + vector search + rule-based rerank.
- “Contrast retrieval” with anti-excerpts to avoid undesired style drift.

## 6.4 Phase 4
- Active learning loop:
  - Director decisions update retrieval weights,
  - high-performing passages promoted to canonical exemplars,
  - low-performing patterns demoted or blacklisted.

---

## Execution integration (end-to-end)

For each stage run in pipeline:

1. load active project profile + memory,
2. load role-specific reference slice,
3. merge prior stage outputs,
4. execute role,
5. validate style/tone/voice adherence,
6. save output + reference usage trace,
7. pass downstream until Director.

Translation branch (explicit request only):
- same reference system is used to preserve original project voice and tone in localized output.

---

## Recommended UI modules

- **Reference Library**: file list, status, usage scope, activation toggles.
- **Excerpt Studio**: curate positive/negative excerpts with tags.
- **Style Notes Board**: manual constraints and voice rules by severity.
- **Auto Summary Inspector**: inspect generated signatures and confidence.
- **Role View Preview**: see what each role receives before execution.
- **Reference Impact in Logs**: execution log item showing which reference slices were applied.
