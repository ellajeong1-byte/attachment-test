# Writers' Room OS — Project Style & Tone Profile System

## Purpose

Define a project-scoped style/tone/voice system that:
- preserves independent writing identity per project,
- supports multiple writing modes (webnovel, literary fiction, nonfiction, essays, workbook/educational),
- enforces Korean-first creative output by default,
- is consumed differently by each role in the sequential workflow,
- works via structured context control (no model fine-tuning required).

---

## 1) Structure of a Style Profile

Style profile is a **project-level, versioned contract** used by all writing roles.

## 1.1 Schema (suggested)

```json
{
  "id": "sty_xxx",
  "project_id": "proj_xxx",
  "version": 3,
  "work_type": "webnovel | literary_fiction | nonfiction | essay | workbook_educational",
  "language": {
    "primary_writing_language": "ko",
    "korean_first": true,
    "localization_policy": "explicit_request_only"
  },
  "prose_shape": {
    "prose_density": 0.0,
    "sentence_rhythm": {
      "short_ratio": 0.0,
      "medium_ratio": 0.0,
      "long_ratio": 0.0,
      "cadence_notes": ""
    },
    "paragraph_rhythm": {
      "avg_sentences_per_paragraph": 0,
      "variation_level": "low | medium | high",
      "break_frequency": "sparse | balanced | frequent"
    },
    "descriptive_level": 0.0,
    "lyrical_vs_restrained": {
      "lyrical": 0.0,
      "restrained": 0.0
    },
    "narrative_stance": "close | moderate | distant | documentary",
    "pov_rules": {
      "allowed_pov": ["1p", "3p_limited", "3p_omniscient", "objective"],
      "pov_switch_policy": "fixed | chapter_boundary_only | director_approval_required"
    }
  },
  "composition_balance": {
    "dialogue_ratio": 0.0,
    "internal_monologue_ratio": 0.0,
    "action_ratio": 0.0,
    "exposition_ratio": 0.0
  },
  "emotion_expression": {
    "emotional_intensity": 0.0,
    "direct_vs_indirect_expression": {
      "direct": 0.0,
      "indirect": 0.0
    },
    "restraint_policy": "strict | balanced | expressive"
  },
  "voice_rules": {
    "narrator_voice": {
      "persona": "",
      "distance": "",
      "lexical_register": "colloquial | neutral | elevated | mixed",
      "forbidden_patterns": []
    },
    "character_speech_principles": [
      {
        "character_id": "char_x",
        "speech_traits": ["..."],
        "forbidden_phrases": ["..."]
      }
    ],
    "korean_naturalness_rules": {
      "ban_literal_translation_artifacts": true,
      "ban_ai_stiff_connectors": true,
      "preferred_ending_styles": ["-다", "-요", "혼합 규칙"],
      "honorific_policy": "consistent_by_character_relation"
    },
    "project_dialogue_rules": ["..."],
    "project_narration_rules": ["..."]
  },
  "genre_specific_constraints": {
    "required_conventions": ["..."],
    "forbidden_conventions": ["..."],
    "platform_adaptation_notes": ""
  },
  "examples": {
    "target_excerpt_ids": ["ref_chunk_1"],
    "anti_excerpt_ids": ["ref_chunk_9"]
  },
  "created_at": "",
  "updated_at": ""
}
```

## 1.2 Normalized relational shape

- `project_style_profiles` (version metadata + global scores)
- `style_rhythm_rules` (sentence/paragraph rhythm)
- `style_balance_rules` (dialogue/internal/action/exposition)
- `style_voice_rules` (narrator + character speech + Korean naturalness)
- `style_examples` (positive/negative reference links)

This supports revision-safe versioning and role-specific retrieval.

---

## 2) Structure of a Tone Profile

Tone profile controls emotional and atmospheric behavior per project.

## 2.1 Schema (suggested)

```json
{
  "id": "ton_xxx",
  "project_id": "proj_xxx",
  "version": 2,
  "core_tone": {
    "primary": ["warm", "intimate"],
    "secondary": ["reflective", "lyrical"],
    "excluded": ["noir"]
  },
  "emotional_register": {
    "baseline": "low | mid | high",
    "variance": "narrow | moderate | wide",
    "escalation_curve": "steady | wave | spike"
  },
  "tonal_restrictions": [
    "No sarcastic narration in grief scenes",
    "No slapstick during high-stakes conflict"
  ],
  "pacing_style": {
    "overall": "slow_burn | balanced | fast_pulse",
    "scene_transition_speed": "measured | brisk | rapid",
    "beat_hold_preference": "linger | balanced | cut_fast"
  },
  "suspense_profile": {
    "suspense_level": 0.0,
    "reveal_strategy": "gradual | staged | late_drop",
    "cliffhanger_frequency": "low | medium | high"
  },
  "restraint_vs_melodrama": {
    "restraint": 0.0,
    "melodrama": 0.0,
    "melodrama_ceiling": 0.0
  },
  "scene_tone_rules": [
    {
      "scene_type": "confession | argument | exposition | reflection",
      "allowed_tones": ["..."],
      "forbidden_tones": ["..."]
    }
  ],
  "created_at": "",
  "updated_at": ""
}
```

## 2.2 Tone profile invariants

- Must always define primary + excluded tones.
- Must define explicit tonal restrictions.
- Must define restraint vs melodrama boundary.
- Must include scene-level exceptions for high-risk scene types.

---

## 3) How the author edits profiles

## 3.1 Editing workflow

1. Open project settings → **Style & Tone Studio**.
2. Choose baseline template by work type (webnovel/literary/nonfiction/etc.).
3. Adjust sliders/controls (density, rhythm, emotion, pacing, suspense).
4. Edit rule lists (forbidden expressions, dialogue rules, tonal restrictions).
5. Attach positive/negative reference excerpts.
6. Save as new profile version with change note.
7. Optionally run “Profile Validation Check” before activating.

## 3.2 Editing UX requirements

- Side-by-side **current vs proposed version diff**.
- “Impact preview” on sample paragraph generation.
- Hard validation for contradictory rules (e.g., high melodrama + strict restraint lock).
- Role visibility map showing which fields each role consumes.

## 3.3 Governance controls

- Only project owner/director can publish active profile version.
- Previous versions remain immutable for reproducibility.
- Workflow runs store `style_profile_version` + `tone_profile_version` for traceability.

---

## 4) How each AI role consumes profiles differently

Role separation is strict; consumption is role-specific.

## 4.1 Trend Strategist
- Reads high-level style/tone identity only.
- Uses it to validate audience/platform fit and commercial viability.
- Output includes risk if profile conflicts with market goals.

Consumes:
- `core_tone.primary/secondary/excluded`
- `genre_specific_constraints`
- `commercial_goal`, `target_platform`

## 4.2 Story Architect
- Converts tone/style constraints into structural beat design.
- Decides where intensity peaks, slower reflective beats, and hook timing should occur.

Consumes:
- `pacing_style`, `emotional_register`, `suspense_profile`
- `pov_rules`, `paragraph_rhythm`

## 4.3 Tone & Style / Emotional Direction Writer
- Primary steward of profile enforcement.
- Translates profile into actionable scene and dialogue constraints.

Consumes:
- Nearly all style/tone fields, especially voice rules, restraint boundaries, emotional expression.

## 4.4 Worldbuilding / Continuity Manager
- Ensures tone/voice continuity with canon and prior outputs.
- Flags profile drift and contradiction with established project identity.

Consumes:
- `voice_rules`, `tonal_restrictions`, prior approved outputs, decision memory.

## 4.5 Episode / Draft Writer
- Applies concrete prose behavior while drafting in Korean-first mode.
- Must obey ratios/rhythm/voice constraints as production guardrails.

Consumes:
- `prose_shape`, `composition_balance`, `emotion_expression`, `voice_rules`.

## 4.6 Director
- Uses profile as acceptance rubric during review.
- Can request revision target when profile adherence fails.

Consumes:
- Full profile + version history + deviation reports.

## 4.7 Translator / Localization (optional, explicit request only)
- Uses source profile to preserve identity in target language.
- Never runs in default creative chain.

Consumes:
- `voice_rules`, `tone_profile`, glossary/term mapping, approved source output.

---

## 5) Automatic application during workflow execution

## 5.1 Context assembly pipeline (per stage run)

For every stage run, system automatically builds:

1. `project_config_bundle` (identity, goals, language policy)
2. `active_style_tone_bundle` (current profile versions)
3. `role_specific_profile_slice` (only relevant fields for the role)
4. `project_memory_retrieval` (project/work bible/decision/revision)
5. `prior_stage_outputs` (structured baton from previous stages)
6. `role_prompt` + project override

Then it executes role inference and saves structured output.

## 5.2 Enforcement mechanics

- Pre-run checks:
  - profile version exists
  - role-specific required fields present
  - translation policy respected
- Run-time checks:
  - output schema validation
  - style/tone compliance scoring
- Post-run checks:
  - drift warnings
  - log entry with profile version + compliance summary

## 5.3 Director-gated revision loop

If Director conditionally approves/rejects:
- route to target prior stage,
- keep same project profile (or explicitly bump version),
- preserve all prior outputs,
- store revision reason in revision memory,
- rerun affected downstream stages with updated inputs.

---

## 6) How this works without model fine-tuning

The system uses **structured prompt orchestration + retrieval + validation**, not retraining.

## 6.1 Mechanism

- Store style/tone/voice as machine-readable config.
- Inject role-specific slices into prompts/context.
- Retrieve approved project examples and anti-examples.
- Apply output validators and compliance scorers.
- Route corrections via revision loops when adherence is low.

## 6.2 Why this is sufficient for MVP and beyond

- Fast iteration per project without training cycles.
- Strong reproducibility via profile versioning.
- Role-specific behavior can be updated instantly.
- Scales across different work types and languages.

## 6.3 Optional future enhancement (without breaking architecture)

- Add lightweight style classifier for compliance feedback.
- Add profile-aware reranker for draft candidates.
- Add project-specific phrase memory and term governance.

These remain additive; core architecture stays retrieval/orchestration-first.

---

## Suggested profile presets by work type (starter)

- **Webnovel**: higher hook frequency, mid-high suspense, faster beat transitions, moderate melodrama ceiling.
- **Literary fiction**: higher prose density, slower pacing, indirect emotional expression, stricter voice nuance.
- **Nonfiction/Narrative nonfiction**: clarity-first rhythm, lower lyrical ratio, evidence-aware narration.
- **Essay**: argument-forward structure, reflective tone controls, rhetorical pacing.
- **Workbook/Educational**: instructional clarity, low ambiguity, stronger dialogue restraint, explicit didactic sequencing.

All presets are editable per project and versioned.
