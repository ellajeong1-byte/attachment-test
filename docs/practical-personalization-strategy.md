# Writers' Room OS — Practical Personalization Strategy (No Initial Fine-Tuning)

## Purpose

Define a practical way to make each project feel like it has “learned” its own voice and habits **without full model retraining at the beginning**.

The strategy uses:
- project-specific style/tone profiles,
- reference manuscript uploads,
- memory accumulation,
- role-specific retrieval,
- automatic context injection,
- Director feedback loops.

---

## 1) How the system feels like project-specific learning without full fine-tuning

## 1.1 Learning illusion through persistent context systems

The user experience of “this project learned over time” can be achieved by combining:

1. **Stable identity constraints**
   - project style profile + tone profile + language policy are always injected.
2. **Reference-grounded behavior**
   - uploaded manuscripts/excerpts create project-specific writing priors.
3. **Memory continuity**
   - decisions, revisions, and canon facts are retained and reused.
4. **Role-specific context shaping**
   - each role sees only the memory/reference slices it needs.
5. **Feedback reinforcement**
   - Director decisions update retrieval and constraint emphasis.

This produces iterative consistency improvements that feel like learning, even though the underlying base model is unchanged.

## 1.2 Core mechanism at runtime

For each stage run, context builder assembles:
- project identity + objective,
- active style/tone profile versions,
- role prompt compilation,
- relevant memory slices,
- relevant reference excerpts,
- required prior stage outputs,
- unresolved revision directives.

Then output is validated and deltas are written back into memory.

This closed loop creates continuity and adaptation per project.

## 1.3 Why this works

- **Specificity beats generic prompting**: role-run context is targeted, not broad.
- **Persistence beats statelessness**: decisions and style constraints survive across runs.
- **Feedback beats one-shot generation**: revision cycles tune behavior over time.
- **Project isolation beats contamination**: no cross-project bleed in memory/references.

---

## 2) What should be built in MVP

Focus on high-leverage systems that deliver “learning-like” behavior immediately.

## 2.1 MVP capability set

1. **Project Style/Tone Profiles (versioned)**
   - editable sliders/rules + hard constraints.
2. **Reference Manuscript Library**
   - upload files, curate positive/negative excerpts, add manual style notes.
3. **Memory Layers (minimum set)**
   - project memory,
   - work bible memory,
   - working memory,
   - decision memory,
   - revision memory.
4. **Role-specific retrieval profiles**
   - each role has capped section budgets and relevance weights.
5. **Automatic context injection in stage runs**
   - no manual copy/paste required.
6. **Director feedback loop integration**
   - approved/rejected directions update decision/revision memory.
7. **Execution diagnostics**
   - alignment scores + dropped-context reasons + dependency checks.

## 2.2 MVP non-goals

- no full model fine-tuning pipeline,
- no cross-project transfer learning,
- no autonomous self-editing of core policies without user approval.

---

## 3) What can be added later

## Phase 2 (post-MVP)

- embedding-based semantic retrieval for references + memory chunks,
- hybrid retrieval (metadata + vector + reranking),
- style/tone drift classifier for automated QA,
- phrase-level glossary enforcement per project.

## Phase 3

- adaptive retrieval weighting from Director outcomes,
- “best exemplar promotion” and “bad pattern suppression”,
- role-level performance dashboards (consistency by stage).

## Phase 4

- selective lightweight adaptation (LoRA/fine-tune) per work type or project cluster,
- only after enough high-quality archived examples exist.

Key rule:
- all later additions must preserve project isolation and deterministic audit trails.

---

## 4) How this supports different writing modes

Different genres/work types need different personalization emphasis.

## 4.1 Literary fiction

Priority:
- voice nuance,
- sentence/paragraph rhythm,
- indirect emotional expression,
- narrator stance continuity.

System emphasis:
- high weight on style profile + voice notes + exemplar excerpts,
- stricter tone drift detection,
- slower pacing rules and subtlety constraints.

## 4.2 Essays

Priority:
- argument flow,
- rhetorical clarity,
- controlled register,
- persuasive cadence.

System emphasis:
- structure and thesis-memory retrieval,
- evidence mapping references,
- conclusion style exemplars,
- less weight on character/dialogue memory.

## 4.3 Nonfiction / narrative nonfiction

Priority:
- factual consistency,
- structural coherence,
- voice credibility,
- audience framing.

System emphasis:
- strong continuity/fact-check slice,
- decision memory for framing changes,
- reference manuscript structure signatures,
- high penalties for contradiction.

## 4.4 Webnovels / serialized fiction

Priority:
- hook cadence,
- character voice consistency,
- emotional pacing,
- continuity across episodes.

System emphasis:
- role chain fidelity (story -> tone -> continuity -> draft),
- relationship-state memory retrieval,
- cliffhanger and retention-aware guidance,
- revision loops for pacing/chemistry adjustments.

---

## Implementation pattern (practical)

For each stage run:
1. resolve project + role,
2. retrieve role-specific memory/reference slices,
3. inject style/tone and prior outputs,
4. execute role,
5. validate alignment,
6. persist output and memory deltas,
7. auto-handoff to next stage.

Over repeated cycles, this creates a project-specific “learned” behavior profile without retraining.

---

## Success criteria

The personalization strategy is working if users report:
- “This project’s voice is consistent.”
- “The system remembers prior decisions and doesn’t repeat rejected directions.”
- “Different projects feel clearly different in style and structure.”
- “I no longer manually copy outputs across role chats.”

These outcomes are achievable in MVP with retrieval/orchestration-first architecture.
