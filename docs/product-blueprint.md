# Writers' Room OS — Consolidated Product Blueprint

## 1) Complete system blueprint

Writers’ Room OS is a **project-centric creative operating system** for serious long-form production, not a chatbot and not a generic document tool.

It is designed to replace manual baton-passing across separate role chats with a deterministic, auditable, role-driven workflow engine.

### Core product mission
- Turn fragmented prompt operations into a **structured production pipeline**.
- Preserve project identity and continuity so outputs improve over time.
- Keep human governance (Director) central for final creative and commercial decisions.

### Non-negotiable product principles
1. **Project-first isolation**: every run, memory, reference, and output is scoped to one project.
2. **Korean-first creative workflow**: default writing language is Korean.
3. **Translation is optional branch**: translator runs only on explicit request.
4. **Role separation**: roles are specialized and cannot collapse into one generic writer role.
5. **Automatic handoff**: outputs move stage-to-stage automatically.
6. **Persistent memory**: decisions, revisions, style, and canon accumulate over time.
7. **Director gate**: no final progression without Director decision.
8. **Auditability**: every transition, prompt compilation, context bundle, and output is traceable.

### Supported writing categories
- serialized webnovel
- literary fiction
- nonfiction
- narrative nonfiction
- essays
- workbook / educational / scholarly-style writing

Each category can use a tailored workflow template while preserving orchestration invariants.

---

## 2) Architecture summary

### A) Experience layer (UI)
- Project Portfolio
- Project Home
- Production Workspace (unit cockpit)
- Memory Center
- Style & Tone Studio
- Reference Library
- Prompt Studio
- Translation Tasks (separate branch)
- Audit & History

### B) Application services layer
- Workflow Definition Service
- Orchestrator Runtime
- Context Assembly Service
- Stage Execution Adapter
- Memory Update Service
- Prompt Compilation Service
- Director Governance Service
- Translation Task Engine
- Logging/Audit Service

### C) Data and policy layer
- Project and membership tables
- Role prompts and output schema tables
- Memory layers and deltas
- Reference manuscript and excerpt tables
- Workflow run/stage run/state transition tables
- Director review and revision cycle tables
- Translation task and localized artifact tables
- RLS policy enforcement for project isolation

### D) Runtime contract layer
- `context_bundle`
- `stage_output`
- `memory_delta`
- `director_decision`
- `translation_task`

All are versioned and append-only compatible.

---

## 3) Module list

1. **Project Management Module**
   - project creation, identity, status, work-type config
   - project separation and membership

2. **Workflow Engine Module**
   - stage sequencing
   - dependency checks
   - handoff scheduling
   - stop/retry/rerun behavior

3. **Role Prompt Management Module**
   - default role prompts
   - project-level overrides
   - restrictions and output schema bindings
   - prompt compilation/versioning

4. **Style & Tone Profile Module**
   - project-specific style and tone definitions
   - profile versioning and activation

5. **Reference Manuscript Module**
   - manuscript uploads
   - excerpt curation
   - manual style notes
   - auto summaries and role slices

6. **Memory System Module**
   - project memory
   - work bible memory
   - working memory
   - decision memory
   - revision memory
   - long-term archive

7. **Role-Specific Retrieval Module**
   - role-aware memory/reference selection
   - context budget controls
   - anti-overload filtering

8. **Production Workspace Module**
   - stage tracker
   - automation controls
   - role output panels
   - context panel
   - logs panel
   - Director review controls

9. **Director Governance Module**
   - approve / conditional / reject
   - revision routing to target stage
   - cycle closure and audit linking

10. **Translation Task Module (Optional Branch)**
- explicit-request trigger only
- translator context assembly
- localized artifact storage and linkage

11. **Audit & Observability Module**
- run logs
- state transitions
- context usage traces
- reproducibility references

---

## 4) Workflow summary

### Default fiction/webnovel chain
1. Trend Strategy
2. Story Structure
3. Tone & Style / Emotional Guidance
4. Continuity Check
5. Draft Writing
6. Director Review

### Stage lifecycle (normalized)
- `not_started -> ready -> context_assembling -> in_progress -> completed`
- failure branches: `failed | blocked`
- revision branches: `revision_requested | stale`

### Automatic handoff protocol
After each stage completion:
1. validate output schema
2. persist output artifact (append-only version)
3. update memory layers (working always; other layers conditionally)
4. assemble next role context bundle
5. enqueue and run next stage automatically

### Director stop point
- Workflow halts at Director stage by default.
- Director chooses: approve / conditional approve / reject.
- Conditional/reject opens revision loop and reroutes to selected stage.

### Project-type variants
Nonfiction/essay/literary/workbook projects may alter stage graph by template,
but cannot remove:
- dependency validation
- memory updates
- output persistence
- Director final gate

---

## 5) Memory summary

### Memory layers
1. **Project Memory**: identity, goals, language policy, core creative rules.
2. **Work Bible Memory**: canon, structure rules, character/world/fact constraints.
3. **Working Memory**: current unit state, unresolved tensions, pending directives.
4. **Decision Memory**: approved/rejected strategic and stylistic decisions.
5. **Revision Memory**: why changes were required and how resolved.
6. **Long-term Archive**: historical outputs, run snapshots, logs, profile versions.

### Memory behavior
- Updated at every stage run.
- Promotion from transient to persistent memory is governance-aware.
- Revision cycles write explicit deltas and link superseded outputs.

### “Learning-like” effect without fine-tuning
Project feels like it remembers and evolves via:
- persistent memory accumulation
- role-specific retrieval
- reference-grounded context
- Director feedback reinforcement

---

## 6) Role summary

### Core roles
1. Data-driven Trend Strategist
2. Story Architect / Structure Writer
3. Tone & Style / Emotional Direction Writer
4. Worldbuilding / Continuity Manager
5. Episode / Draft Writer
6. Director

### Optional role
7. Translator / Localization Editor

### Role execution contract
Each role receives:
- compiled role prompt (default + project override)
- role-specific memory slices
- style/tone profile slices
- relevant reference slices
- required prior stage outputs

Each role emits:
- structured output payload
- diagnostics/risk markers
- metadata for memory update and downstream handoff

### Role separation safeguards
- forbidden actions and schema constraints enforced by role
- roles cannot bypass Director governance
- roles cannot read cross-project context

---

## 7) Language / translation summary

### Korean-first policy
- Primary creative writing language defaults to Korean.
- Korean-first means default behavior, not Korean-only capability.

### Translation policy
- Translation is not in default writing workflow.
- Translator runs only via explicit user request.
- Supported request scopes:
  - full project
  - unit (episode/chapter/section)
  - excerpt
  - synopsis
  - pitch version

### Translator input requirements
- style profile
- tone profile
- reference manuscripts
- relevant project memory
- source artifacts
- audience/market goals
- glossary/localization preferences

### Translation output handling
- localized artifacts stored separately from Korean source artifacts
- source-linked by artifact id + source version
- localization states tracked independently from writing workflow states

---

## 8) MVP summary

### MVP must include
- project creation and separation
- core role architecture
- project style/tone profiles
- reference manuscript support
- layered memory baseline
- workflow state model
- production workspace
- stage-by-stage outputs
- Director review and revision loop
- Korean-first creative flow
- optional translator role (explicit request only)

### MVP should prioritize build order
1. Data contracts + schema + state model
2. Core orchestrator + context assembly + persistence
3. Production workspace UI + Director gate
4. Style/reference/memory editors + translation task panel

### MVP intentionally excludes
- full fine-tuning pipelines
- autonomous branching intelligence at scale
- heavy self-governance without human oversight
- highly advanced retrieval optimization

---

## 9) Future expansion summary

### Phase 2
- semantic retrieval for memory/reference chunks
- hybrid retrieval and reranking
- drift detectors (style/tone/continuity)

### Phase 3
- adaptive retrieval weighting based on Director outcomes
- exemplar promotion / anti-pattern suppression
- analytics for consistency and throughput

### Phase 4
- selective lightweight adaptation (e.g., LoRA/fine-tune) after sufficient curated data
- advanced planning modules as optional layers

### Expansion guardrails
All future expansion must preserve:
- project isolation
- Korean-first default
- role separation
- Director governance
- translation branch separation
- append-only auditability and reproducibility

---

## Final product identity statement

Writers’ Room OS is a **project-scoped editorial production operating system** that automates role-to-role creative workflow, preserves memory continuity, enforces governance, and supports controlled localization—so each project feels coherent, persistent, and increasingly refined over time.
