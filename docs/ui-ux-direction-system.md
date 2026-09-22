# Writers' Room OS — UI/UX Direction System

## Purpose

Define a UI/UX direction that feels like:
- an internal editorial operating system,
- a serious creative production environment,
- a project-based writers’ room control center.

And explicitly does **not** feel like:
- a toy AI writing app,
- a generic chatbot,
- a blank dashboard,
- a simple document editor.

---

## 1) Information architecture

## 1.1 IA principles

1. **Project-first hierarchy**
   - all primary workflows are entered through project context.
2. **Operational visibility over novelty UI**
   - workflow states, logs, memory, and decisions are always visible.
3. **Role-output centricity**
   - outputs are structured artifacts, not chat bubbles.
4. **Governance by design**
   - Director review and revision routing are first-class.
5. **Branch-aware architecture**
   - translation is visible but separate from default writing pipeline.

## 1.2 IA map (top-level)

- Workspace Shell
  - Project Switcher
  - Global Activity + Alerts
  - User/Role Controls
- Project Home
  - Project Identity
  - Pipeline Health
  - Recent Decisions
- Production Workspace (unit-level cockpit)
  - Stage Tracker
  - Automation Controls
  - Role Outputs
  - Input Context
  - Logs
  - Director Review
- Memory Center
  - Project Memory
  - Work Bible
  - Decision/Revision Memory
  - Archive/Snapshots
- Style & Tone Studio
- Reference Library
- Prompt Studio
- Translation Tasks (optional branch)
- Audit & History

---

## 2) Main pages

## 2.1 Project Portfolio
Purpose:
- manage multiple independent projects.

Key content:
- project cards with work type, stage health, last run, language policy.
- quick status indicators: `running`, `awaiting_director`, `revision_requested`.
- create project / archive project / switch project.

## 2.2 Project Home (Control Center)
Purpose:
- high-level operational view for one project.

Key content:
- project identity block,
- active workflow template,
- open work units,
- memory health snapshot,
- pending director actions,
- translation queue summary.

## 2.3 Production Workspace (Core Page)
Purpose:
- execute one production unit (episode/chapter/section/module).

Key content:
- Header metadata,
- stage tracker with statuses,
- automation controls,
- role output panels,
- context panel,
- logs panel,
- Director review panel,
- optional translation request panel (separate block).

## 2.4 Memory Center
Purpose:
- operationalize accumulated memory, not hide it.

Key content:
- layer tabs: project/work bible/working/decision/revision/archive,
- entry source and confidence,
- unresolved issues,
- promotion queue (working -> persistent).

## 2.5 Style & Tone Studio
Purpose:
- manage project identity rules.

Key content:
- style profile editor,
- tone profile editor,
- version diff,
- reference-linked examples,
- active version indicator.

## 2.6 Reference Library
Purpose:
- manage manuscript assets and excerpt curation.

Key content:
- uploaded references,
- excerpt studio,
- manual style notes,
- role-view previews.

## 2.7 Prompt Studio
Purpose:
- safe role prompt customization.

Key content:
- default vs project override diff,
- policy lint warnings,
- output schema compatibility checks,
- draft/publish workflow.

## 2.8 Translation Tasks (Optional)
Purpose:
- run localization by explicit request only.

Key content:
- task creation form,
- scope selector (project/unit/excerpt/synopsis/pitch),
- target language and mode,
- task state timeline,
- localized output links.

## 2.9 Audit & History
Purpose:
- traceability and replay confidence.

Key content:
- state transitions,
- stage runs,
- director decisions,
- revision cycles,
- context bundle refs used per run.

---

## 3) Key navigation model

## 3.1 Primary nav (persistent left rail)

1. Portfolio
2. Project Home
3. Production Workspace
4. Memory Center
5. Style & Tone Studio
6. Reference Library
7. Prompt Studio
8. Translation Tasks
9. Audit & History

## 3.2 Secondary nav (page-level tabs)

Inside each major module:
- segmented tabs for dense operational domains,
- sticky action bar for frequent actions,
- filter/search controls where artifacts are numerous.

## 3.3 Context locking model

- Active project badge always visible in header.
- Switching project triggers hard context reset.
- All page URLs include `project_id` and (if applicable) `work_unit_id`.

## 3.4 Fast command palette (recommended)

Commands:
- “Run current stage”
- “Send to Director”
- “Open revision cycle”
- “Request translation (English pitch version)”

This reinforces OS-like operation speed.

---

## 4) How to make project identity visible

## 4.1 Identity strip (always-on)

Display in workspace header:
- project title,
- work type,
- genre/subgenre,
- audience/platform,
- primary writing language,
- active style profile version,
- active tone profile version.

## 4.2 Identity-driven UI cues

- project color accent/token per project,
- short project mission statement in project home,
- explicit “forbidden style patterns” badge,
- top memory anchors pinned (e.g., director principles, canon constraints).

## 4.3 “What defines this project?” panel

A compact card in key pages showing:
- voice summary,
- tone summary,
- reference signature,
- current creative objective.

This prevents generic-feeling outputs and keeps team context grounded.

---

## 5) How to make workflow and memory feel operational

## 5.1 Operational workflow cues

- stage tracker shows real statuses and dependencies,
- run controls show active stage + last result + runtime,
- blocked/failure states display explicit reason and next action,
- downstream stale indicators after revisions.

## 5.2 Memory visibility patterns

- memory panel visible in production workspace (not hidden deep),
- show “memory used in this stage run” list with source IDs,
- show “new memory written” after each stage,
- highlight unresolved revision memory until resolved.

## 5.3 Log-first transparency

Logs must show:
- stage started/completed/failed,
- output saved,
- memory updated,
- director action,
- revision requested,
- translation task requested/completed.

Each log item should link to artifact and run details.

## 5.4 Director governance visibility

- Director panel is fixed and prominent in workspace,
- decisions immediately affect stage states,
- revision routing visibly marks target and stale downstream stages,
- approval closes cycle with archived run snapshot.

## 5.5 Translation separation UX

- translation request controls in separate panel/module,
- clear label: “Not part of default writing workflow”,
- separate state badges and timelines,
- localized outputs shown as linked variants, not replacements.

---

## Visual direction (practical)

- Dark editorial palette with high contrast hierarchy.
- Dense but readable cards (operations center aesthetic).
- Typography optimized for long-form metadata + logs.
- Semantic status colors tied to workflow state model.
- Minimal decorative noise; maximize traceability and action clarity.

---

## UX success criteria

UX direction is successful if users report:
- “I can run production without manual copy-paste.”
- “I always know which stage we’re in and why.”
- “I can see what memory/context influenced each output.”
- “Director decisions and revisions are clear and controllable.”
- “Translation is available when needed but never pollutes default writing flow.”

This is the target experience for an internal editorial operating system.
