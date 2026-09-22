# Writers' Room OS — Core Production Workflow System

## Purpose

Define the production workflow that replaces manual copy-paste baton passing across role-specific chats with a structured, automated, project-scoped orchestration engine.

This system must support:
- serialized fiction / episode workflows,
- chapter-based novel workflows,
- essay and nonfiction section workflows,
- workbook/educational structured workflows,
while preserving:
- strict role orchestration,
- project memory continuity,
- revision cycles,
- Director-gated progression,
- Korean-first default creative output,
- explicit-request-only translation branch.

---

## 1) Ideal workflow architecture

## 1.1 Architecture layers

### A. Workflow Definition Layer
Defines stage order, dependencies, required inputs/outputs, and review gates.

- `workflow_templates` (by work type)
- `project_workflows` (project-level overrides)
- `stage_dependency_rules` (required upstream artifacts)
- `director_gate_rules` (approval criteria)

### B. Orchestration Layer
Runs stage sequence automatically.

- resolves next stage,
- assembles role-specific context bundle,
- executes role,
- validates output,
- persists output,
- updates memory,
- enqueues next stage.

### C. Context & Memory Layer
Builds role-specific input from project-scoped data.

- project memory
- work bible memory
- working memory
- decision memory
- revision memory
- style/tone profile
- reference manuscript slices
- required prior stage outputs

### D. Governance Layer
Controls human intervention and final progression.

- Director review decisions
- revision routing
- lock/unlock states
- audit logs and reproducibility snapshots

### E. Translation Branch Layer (Optional)
Separate task branch (not default chain), explicit request only.

---

## 1.2 Default fiction/webnovel workflow

1. **Trend Strategy**
2. **Story Structure**
3. **Tone & Style / Emotional Guidance**
4. **Continuity Check**
5. **Draft Writing**
6. **Director Review**

Behavior:
- fully automated handoff between stages,
- memory updated after each stage,
- chain halts at Director decision point.

---

## 2) Customizing workflows by project type without breaking system

Customization is allowed at project level, but orchestration contract remains fixed.

## 2.1 Fixed invariants (cannot be broken)

- Every stage must have:
  - role owner,
  - required input contract,
  - output schema,
  - dependency declaration.
- Every run must:
  - write output artifact,
  - write memory delta,
  - write execution log.
- Every workflow must end in Director review gate.
- Translation remains outside default chain.

## 2.2 Customization surface by work type

### Serialized fiction / webnovel
- uses default 6-stage template.
- can tune stage prompts/weights, not remove Director gate.

### Chapter-based literary novel
- optional add `Theme Integrity` or `Narrative Voice Audit` stage before Draft/Director.
- stage order still dependency-validated.

### Nonfiction / essay
- may replace Trend stage with `Argument Positioning` stage.
- may split structure into `Outline` + `Evidence Mapping`.
- still must include continuity/fact integrity + Director gate.

### Workbook / educational
- may include `Pedagogical Sequencing` and `Instruction Clarity` stages.
- still requires memory updates and final Director approval.

## 2.3 Template strategy

- `template_fiction_episode_v1`
- `template_novel_chapter_v1`
- `template_essay_nonfiction_v1`
- `template_workbook_education_v1`

Project chooses a base template then applies constrained overrides:
- add optional stages,
- adjust stage prompts,
- adjust validation thresholds,
- keep mandatory orchestration invariants.

---

## 3) How stage-to-stage handoff works

## 3.1 Handoff pipeline (automatic)

After stage `S` completes:

1. Validate output schema.
2. Persist stage output version.
3. Update memory layers (working always; others conditionally).
4. Resolve next stage `S+1` from workflow graph.
5. Build `context_bundle(S+1)` including:
   - role prompt + project override,
   - project memory slice,
   - style/tone profile,
   - relevant reference slices,
   - prior required outputs (including `S` output),
   - active revision directives.
6. Enqueue and run `S+1` automatically.

## 3.2 Required context fields for every stage

- `project_id`, `work_unit_id`
- `role_name`
- `project_identity`
- `language_policy` (Korean-first)
- `style_tone_snapshot_refs`
- `memory_snapshot_refs`
- `required_prior_output_refs`
- `reference_slice_refs`
- `director_priority_notes` (if any)

## 3.3 Failure / block behavior

- if required prior output missing => `blocked` state,
- if output validation fails => `failed` and retry policy,
- if continuity contradiction severe => pause chain and notify Director.

---

## 4) Where human intervention is required

Automation-first does not mean human-free.

## 4.1 Required human intervention points

1. **Project setup**
- set work type, style/tone, language policy, references, prompts.

2. **Director gate**
- final approve / conditional / reject decisions.

3. **Revision directives**
- when conditional/reject, Director specifies target stage and reason.

4. **Major policy changes**
- style/tone profile version updates,
- core memory promotions or canonical rule changes.

5. **Explicit translation request**
- user must invoke translation task intentionally.

## 4.2 Optional human intervention

- manual stage rerun,
- manual memory edit/curation,
- manual excerpt tagging,
- prompt override tuning.

---

## 5) How Director controls final progression

## 5.1 Director as final control gate

Director receives:
- latest outputs from all relevant prior stages,
- adherence diagnostics (style/tone/reference/continuity),
- unresolved revision and risk summary,
- decision history for coherence.

Director actions:
- `approve`
- `conditional_approve`
- `reject`

## 5.2 Decision effects

### Approve
- work unit moves to `approved`.
- memory promotions finalized.
- workflow cycle closes.

### Conditional approve
- create revision cycle entry.
- select target stage.
- specify required changes.
- orchestration reruns from target stage to Director.

### Reject
- mark as `rejected` / `revision_required`.
- force targeted reroute with blocking reason.
- prevent downstream publication actions until resolved.

## 5.3 Director safeguards

- cannot bypass missing dependency warnings.
- cannot erase historical outputs (append-only versions).
- every decision is logged and tied to memory/revision deltas.

---

## Operational summary

For every project work unit, the system should feel like a real team:
- roles run in sequence,
- each role receives only needed context,
- outputs flow automatically to the next role,
- memory accumulates and influences future runs,
- Director governs quality and progression,
- translation remains a separate explicit-request branch.

This fully replaces manual chat-to-chat baton passing while preserving continuity and creative identity over time.
