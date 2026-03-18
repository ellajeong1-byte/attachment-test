# Writers' Room OS — MVP Scope Definition

## Purpose

Define a realistic but high-impact MVP that is strong enough to replace manual copy-paste baton passing across role-based chats while keeping implementation feasible.

MVP principle:
- **automation-first, governance-safe, project-scoped**.

---

## 1) Exact MVP feature set

This is the required MVP baseline.

## 1.1 Project foundation

1. **Project creation**
   - Create project with core identity fields:
     - title
     - work type
     - genre/subgenre
     - audience/market/platform
     - commercial goal
     - status

2. **Project separation**
   - hard project boundary (`project_id`) across all data domains,
   - RLS-enforced access control,
   - no cross-project retrieval for writing contexts.

## 1.2 Role architecture (core)

3. **Core role model**
   - Trend Strategist
   - Story Architect
   - Tone & Style / Emotional Direction
   - Continuity Manager
   - Episode/Draft Writer
   - Director

4. **Role prompt management (MVP level)**
   - default role prompts,
   - project-level override prompt (layered/append),
   - role allowed/forbidden action rules,
   - role output schema binding.

## 1.3 Style / reference / memory

5. **Project style/tone profile**
   - editable profile with versioning,
   - active version attached to stage runs.

6. **Reference manuscript support**
   - upload files,
   - curated excerpts,
   - manual style notes,
   - role-targeted reference slices (simple deterministic slice selection).

7. **Project memory system (minimum layers)**
   - project memory,
   - work bible memory,
   - working memory,
   - decision memory,
   - revision memory,
   - long-term archive (stage outputs + logs).

## 1.4 Workflow and execution

8. **Workflow state model**
   - run-level states,
   - stage-level states,
   - director review states,
   - revision routing states.

9. **Automation engine (MVP behavior)**
   - stage-by-stage execution in configured order,
   - context assembly per role,
   - output save per stage,
   - memory update per stage,
   - auto handoff to next stage,
   - stop at Director Review by default.

10. **Production workspace UI**
- Header + unit metadata
- Stage tracker
- Automation controls
- Role output panels
- Input context panel
- Execution logs panel
- Director review panel

11. **Stage-by-stage outputs**
- structured output payload per role
- persisted by project + unit + stage + version

12. **Director review + revision loop**
- approve / conditional approve / reject
- target-stage reroute
- stale downstream invalidation
- rerun to Director

## 1.5 Language and translation policy

13. **Korean-first creative workflow**
- default writing output language is Korean,
- enforced in creative stages unless explicitly overridden by policy.

14. **Optional translator role (explicit request only)**
- separate translation task panel,
- separate translation task state machine,
- source-linked localized artifact storage,
- not included in default creative stage chain.

---

## 2) What should be built first

Implementation order should follow dependency and risk.

## Phase 0 — Data and contracts (first)

1. Project schema + RLS + membership
2. Workflow run/stage run schema
3. Stage output schema + versioning model
4. Core memory tables
5. Role prompt + output schema contracts

Why first:
- without this, automation cannot be deterministic or auditable.

## Phase 1 — Engine core

1. Context assembly service (role-specific bundle)
2. Stage executor adapter
3. Handoff controller (next-stage enqueue)
4. Memory delta writer
5. Transition logger

Why second:
- this replaces manual baton-passing behavior.

## Phase 2 — Production workspace UI

1. Stage tracker + controls
2. Role outputs + context panel
3. Logs + Director review panel
4. Revision reroute UX

Why third:
- this exposes engine behavior to users and allows governance.

## Phase 3 — Style/reference and translation branch

1. Style/tone profile editing and version activation
2. Reference upload + excerpt curation
3. Translator task panel and separate translation engine

Why fourth:
- adds quality and localization power without blocking core baton-passing.

---

## 3) What can be deferred

The following are valuable but not required for MVP launch:

1. Full autonomous branching intelligence
2. Full model fine-tuning pipelines
3. Advanced retrieval optimization (hybrid rerank/agentic query planners)
4. Heavy multi-agent self-governance with low human oversight
5. Complex adaptive policy self-editing
6. Advanced market analytics dashboards
7. Cross-project style transfer tooling

These can be layered on after deterministic orchestration is stable.

---

## 4) How to keep MVP extensible

## 4.1 Extensibility principles

1. **Schema-first modularity**
   - separate tables for runs, outputs, memory, prompts, references, translations.
2. **Version everything**
   - prompt versions, profile versions, output versions, schema versions.
3. **Immutable artifacts + append-only logs**
   - enables replay, rollback, audits, and experimentation.
4. **Template-driven workflows**
   - project types swap templates without changing engine core.
5. **Policy guard blocks**
   - ensure future prompt customizations do not break invariants.
6. **Service boundaries**
   - orchestration, context assembly, execution, memory, governance, translation separated.

## 4.2 MVP compatibility contracts

Define stable interfaces now:
- `context_bundle` contract
- `stage_output` contract
- `memory_delta` contract
- `director_decision` contract
- `translation_task` contract

Future features should extend these contracts, not replace them.

## 4.3 Upgrade path

- Add semantic retrieval behind same context assembly API.
- Add classifier/scoring engines as post-stage validators.
- Add lightweight adaptation/fine-tuning only after enough curated archive data.
- Add advanced multi-agent planning as optional layer, not core dependency.

---

## MVP success criteria

MVP is successful when a user can:

1. create multiple isolated projects,
2. configure style/tone + references,
3. run end-to-end stage automation,
4. see automatic role-to-role handoff without copy-paste,
5. review and reroute with Director,
6. preserve memory and continuity across runs,
7. request translation as an explicit separate task.

If these are consistently true, the MVP has delivered the product’s core promise.
