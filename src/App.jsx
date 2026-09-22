import { useEffect, useMemo, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

const WORKFLOW_TEMPLATES = {
  webnovel: [
    { key: 'trend_strategy', label: 'Trend Strategy', role: 'Trend Strategist' },
    { key: 'story_structure', label: 'Story Structure', role: 'Story Architect' },
    { key: 'tone_style_guidance', label: 'Tone & Style / Emotional Guidance', role: 'Tone & Style / Emotional Direction Writer' },
    { key: 'continuity_check', label: 'Continuity Check', role: 'Worldbuilding / Continuity Manager' },
    { key: 'draft_writing', label: 'Draft Writing', role: 'Episode Writer' },
    { key: 'director_review', label: 'Director Review', role: 'Director' },
  ],
  nonfiction: [
    { key: 'trend_strategy', label: 'Argument Positioning', role: 'Trend Strategist' },
    { key: 'story_structure', label: 'Structure & Evidence Map', role: 'Story Architect' },
    { key: 'tone_style_guidance', label: 'Tone & Style Guidance', role: 'Tone & Style / Emotional Direction Writer' },
    { key: 'continuity_check', label: 'Fact & Continuity Check', role: 'Worldbuilding / Continuity Manager' },
    { key: 'draft_writing', label: 'Draft Writing', role: 'Episode Writer' },
    { key: 'director_review', label: 'Director Review', role: 'Director' },
  ],
};

const OUTPUT_FIELDS = {
  trend_strategy: ['market_angle', 'audience_hooks', 'risk_factors', 'commercial_fit'],
  story_structure: ['unit_objective', 'key_sections', 'turning_point', 'ending_hook', 'next_unit_linkage'],
  tone_style_guidance: ['emotional_keywords', 'tension_points', 'voice_rules', 'pacing_notes', 'tone_risks'],
  continuity_check: ['continuity_issues_found', 'setting_or_fact_conflicts', 'voice_consistency_warnings', 'approved_notes'],
  draft_writing: ['full_korean_draft', 'section_breakdown', 'unresolved_notes'],
  director_review: ['decision', 'commercial_evaluation', 'consistency_evaluation', 'key_issue', 'revision_target', 'approval_note'],
};

const OUTPUT_LABELS = {
  market_angle: 'Market angle', audience_hooks: 'Audience hooks', risk_factors: 'Risk factors', commercial_fit: 'Commercial fit',
  unit_objective: 'Unit objective', key_sections: 'Key scenes/sections', turning_point: 'Turning point', ending_hook: 'Ending hook', next_unit_linkage: 'Connection to previous and next unit',
  emotional_keywords: 'Emotional keywords', tension_points: 'Tension points', voice_rules: 'Voice rules', pacing_notes: 'Pacing notes', tone_risks: 'Tone risk notes',
  continuity_issues_found: 'Continuity issues found', setting_or_fact_conflicts: 'Setting/fact conflicts', voice_consistency_warnings: 'Voice consistency warnings', approved_notes: 'Approved continuity notes',
  full_korean_draft: 'Full Korean draft', section_breakdown: 'Section breakdown', unresolved_notes: 'Unresolved writing notes',
  decision: 'Decision', commercial_evaluation: 'Commercial evaluation', consistency_evaluation: 'Consistency evaluation', key_issue: 'Key issue', revision_target: 'Revision target', approval_note: 'Approval note',
};

const LOCAL_KEY = 'writers_room_production_workspace';
const now = () => new Date().toISOString();

function createInitialWorkspace() {
  const templateKey = 'webnovel';
  const stages = WORKFLOW_TEMPLATES[templateKey];
  return {
    id: 'unit_021',
    project_id: 'proj_crimson_oath',
    project_name: 'Crimson Oath',
    project_type: 'Serialized Webnovel',
    unit_type: 'Episode',
    unit_number: '21',
    unit_title: 'The Rooftop Vow',
    workflow_template: templateKey,
    primary_language: 'Korean',
    stage_status: Object.fromEntries(stages.map((s, i) => [s.key, i === 0 ? 'ready' : 'not_started'])),
    stage_outputs: {},
    current_stage: stages[0].key,
    status: 'ready',
    revision_count: 0,
    director_decision: 'pending',
    director_notes: 'Protect pacing and maintain chemistry tension while preserving continuity.',
    context: {
      project_summary: 'A romance-thriller saga about rival heirs in a staged engagement that becomes real.',
      style_profile_summary: 'Cinematic Korean prose, medium density, dynamic dialogue, restrained melodrama.',
      tone_profile_summary: 'Intimate + reflective baseline with high-tension spikes and disciplined emotional release.',
      reference_excerpts: 'Ref A: rooftop confrontation cadence. Ref B: subtext-heavy jealousy dialogue pattern.',
      relevant_memory: 'Previous director decision: tighten act-2 pacing and protect Yuna voice consistency.',
      previous_output_summary: 'Episode 20 ended with a fabricated recording reveal cliffhanger.',
    },
    translation_requests: [],
    execution_logs: [{ timestamp: now(), type: 'system', message: 'Production workspace initialized.' }],
    automation: { running: false, active_stage: null, start_time: null, end_time: null, last_execution_result: 'idle' },
    revision_cycles: [],
    updated_at: now(),
  };
}

function AuthPanel({ onPreview, onAuthenticated }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    const { error } = await (mode === 'signin'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password }));
    if (!error) onAuthenticated();
    setLoading(false);
  };

  return (
    <section className="auth-panel">
      <h1>Writers&apos; Room OS</h1>
      <p className="auth-subtitle">Core Production Workspace</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /></label>
        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      </form>
      <div className="auth-footer">
        <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}</button>
        <button type="button" className="ghost-button" onClick={onPreview}>Open Preview Workspace</button>
      </div>
    </section>
  );
}

function ProductionWorkspace({ user, onSignOut }) {
  const [unit, setUnit] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (!saved) return createInitialWorkspace();
    try { return JSON.parse(saved); } catch { return createInitialWorkspace(); }
  });
  const [selectedStage, setSelectedStage] = useState('trend_strategy');
  const [revisionReason, setRevisionReason] = useState('');
  const [revisionTarget, setRevisionTarget] = useState('story_structure');
  const [translationScope, setTranslationScope] = useState('chapter_episode');
  const [translationTarget, setTranslationTarget] = useState('English');
  const timerRef = useRef(null);

  const stages = WORKFLOW_TEMPLATES[unit.workflow_template] || WORKFLOW_TEMPLATES.webnovel;

  useEffect(() => localStorage.setItem(LOCAL_KEY, JSON.stringify(unit)), [unit]);

  const appendLog = (type, message) => setUnit((prev) => ({
    ...prev,
    execution_logs: [{ timestamp: now(), type, message }, ...prev.execution_logs].slice(0, 120),
    updated_at: now(),
  }));

  const nextStageKey = (stageKey) => {
    const idx = stages.findIndex((s) => s.key === stageKey);
    return idx >= 0 && idx < stages.length - 1 ? stages[idx + 1].key : null;
  };

  const setDraftOutput = (stageKey) => {
    const mock = {
      trend_strategy: { market_angle: 'Retention-driven betrayal arc with confession fake-out.', audience_hooks: 'Rooftop confrontation, jealousy trigger, final sting.', risk_factors: 'Potential pacing dip in middle section.', commercial_fit: 'Strong platform fit for weekly romance-thriller readers.' },
      story_structure: { unit_objective: 'Force both leads to choose trust over strategic defense.', key_sections: 'Boardroom pressure → private fracture → rooftop confrontation → sting.', turning_point: 'Evidence proves the rumor source was fabricated.', ending_hook: 'A sealed invitation from rival family arrives.', next_unit_linkage: 'Seeds chapter 22 infiltration thread.' },
      tone_style_guidance: { emotional_keywords: 'restraint, ache, defiance, vulnerable trust', tension_points: 'delayed confession, interrupted touch, strategic silence', voice_rules: 'Yuna concise under stress; Jihoon ironic but controlled.', pacing_notes: 'slow-burn setup then sharp release near ending hook.', tone_risks: 'Avoid melodrama overstatement in midpoint.' },
      continuity_check: { continuity_issues_found: 'No blockers; verify timeline beat around gala leak.', setting_or_fact_conflicts: 'Add line explaining rooftop access.', voice_consistency_warnings: 'Scene 2 phrasing too formal for Jihoon.', approved_notes: 'Ring continuity and family hierarchy references intact.' },
      draft_writing: { full_korean_draft: '장면 1... 장면 2... 장면 3... (초안)', section_breakdown: '1) 압박 2) 균열 3) 대면 4) 훅', unresolved_notes: 'Need cleaner bridge into end sting.' },
      director_review: { decision: 'conditionally_approve', commercial_evaluation: 'High retention potential.', consistency_evaluation: 'Minor continuity patch needed.', key_issue: 'Midpoint pacing slack.', revision_target: 'story_structure', approval_note: 'Tighten midpoint by 15% and keep emotional restraint.' },
    };
    setUnit((prev) => ({ ...prev, stage_outputs: { ...prev.stage_outputs, [stageKey]: { ...(prev.stage_outputs[stageKey] || {}), ...(mock[stageKey] || {}) } }, updated_at: now() }));
  };

  const runSingleStage = (stageKey) => {
    if (unit.automation.running) return;
    setUnit((prev) => ({
      ...prev,
      status: 'in_progress',
      current_stage: stageKey,
      stage_status: { ...prev.stage_status, [stageKey]: 'in_progress' },
      automation: { ...prev.automation, running: true, active_stage: stageKey, start_time: prev.automation.start_time || now(), end_time: null, last_execution_result: `running:${stageKey}` },
      updated_at: now(),
    }));
    appendLog('stage_started', `${stageKey} started.`);

    timerRef.current = window.setTimeout(() => {
      setDraftOutput(stageKey);
      setUnit((prev) => {
        const n = nextStageKey(stageKey);
        const statuses = { ...prev.stage_status, [stageKey]: 'completed' };
        if (n && statuses[n] === 'not_started') statuses[n] = 'ready';
        return {
          ...prev,
          status: n ? 'ready' : 'awaiting_director',
          current_stage: n || 'director_review',
          stage_status: statuses,
          automation: { ...prev.automation, running: false, active_stage: null, end_time: now(), last_execution_result: `success:${stageKey}` },
          updated_at: now(),
        };
      });
      appendLog('stage_completed', `${stageKey} completed.`);
      appendLog('output_saved', `${stageKey} output saved.`);
    }, 700);
  };

  const runFullWorkflow = async () => {
    appendLog('workflow_started', 'Full workflow execution started.');
    let stage = stages.find((s) => ['ready', 'revision_requested'].includes(unit.stage_status[s.key]))?.key || unit.current_stage;
    while (stage && stage !== 'director_review') {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => { runSingleStage(stage); window.setTimeout(resolve, 850); });
      stage = nextStageKey(stage);
    }
    setUnit((prev) => ({ ...prev, current_stage: 'director_review', stage_status: { ...prev.stage_status, director_review: 'ready' }, status: 'awaiting_director', updated_at: now() }));
    appendLog('sent_to_director', 'Workflow reached Director Review checkpoint.');
  };

  const stopWorkflow = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setUnit((prev) => ({ ...prev, status: 'paused', automation: { ...prev.automation, running: false, active_stage: null, end_time: now(), last_execution_result: 'stopped_by_user' }, updated_at: now() }));
    appendLog('stage_failed', 'Workflow manually stopped.');
  };

  const sendToDirector = () => {
    setUnit((prev) => ({ ...prev, current_stage: 'director_review', status: 'awaiting_director', stage_status: { ...prev.stage_status, director_review: 'ready' }, updated_at: now() }));
    appendLog('sent_to_director', 'Sent directly to Director Review.');
  };

  const updateOutput = (stage, field, value) => setUnit((prev) => ({ ...prev, stage_outputs: { ...prev.stage_outputs, [stage]: { ...(prev.stage_outputs[stage] || {}), [field]: value } }, updated_at: now() }));

  const directorAction = (decision) => {
    if (decision === 'approve') {
      setUnit((prev) => ({ ...prev, status: 'approved', director_decision: 'approved', stage_status: { ...prev.stage_status, director_review: 'approved' }, updated_at: now() }));
      appendLog('director_action', 'Director approved production unit.');
      return;
    }
    setUnit((prev) => ({
      ...prev,
      status: decision === 'reject' ? 'rejected' : 'revision_requested',
      director_decision: decision,
      current_stage: revisionTarget,
      revision_count: prev.revision_count + 1,
      stage_status: { ...prev.stage_status, director_review: decision === 'reject' ? 'rejected' : 'revision_requested', [revisionTarget]: 'revision_requested' },
      revision_cycles: [{ created_at: now(), decision, target: revisionTarget, reason: revisionReason || 'Director requested revision.' }, ...prev.revision_cycles],
      updated_at: now(),
    }));
    appendLog('revision_requested', `Director ${decision}; reroute to ${revisionTarget}.`);
  };

  const requestTranslation = () => {
    setUnit((prev) => ({
      ...prev,
      translation_requests: [{ id: `tr_${Date.now()}`, scope: translationScope, target: translationTarget, status: 'queued', created_at: now() }, ...prev.translation_requests],
      updated_at: now(),
    }));
    appendLog('translation_requested', `Translation requested: ${translationScope} → ${translationTarget}.`);
  };

  const contextFeed = useMemo(() => {
    const idx = stages.findIndex((s) => s.key === unit.current_stage);
    return stages.slice(0, Math.max(0, idx)).map((s) => ({ label: s.label, output: unit.stage_outputs[s.key] || {} }));
  }, [stages, unit.current_stage, unit.stage_outputs]);

  return (
    <div className="workspace-shell">
      <header className="workspace-header panel">
        <div>
          <p className="overline">Production Workspace</p>
          <h1>{unit.project_name}</h1>
          <p className="header-sub">{unit.project_type} · {unit.unit_type} {unit.unit_number}: {unit.unit_title}</p>
        </div>
        <div className="header-meta">
          <p><strong>Current stage:</strong> {unit.current_stage}</p>
          <p><strong>Primary language:</strong> {unit.primary_language}</p>
          <p><strong>Last updated:</strong> {new Date(unit.updated_at).toLocaleString()}</p>
          <p><strong>Operator:</strong> {user?.email ?? 'Preview mode'}</p>
          <button type="button" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <section className="panel stage-tracker">
        {stages.map((s) => (
          <button key={s.key} type="button" className={`stage-chip status-${unit.stage_status[s.key]}`} onClick={() => setSelectedStage(s.key)}>
            <span>{s.label}</span>
            <small>{unit.stage_status[s.key]}</small>
          </button>
        ))}
      </section>

      <section className="workspace-grid">
        <article className="panel automation-panel">
          <div className="panel-header"><h2>Automation Controls</h2></div>
          <div className="control-buttons">
            <button type="button" onClick={runFullWorkflow}>Run Full Workflow</button>
            <button type="button" onClick={() => runSingleStage(unit.current_stage)}>Run Current Stage</button>
            <button type="button" onClick={() => runSingleStage(selectedStage)}>Re-run Selected Stage</button>
            <button type="button" onClick={stopWorkflow}>Stop Workflow</button>
            <button type="button" onClick={sendToDirector}>Send to Director Review</button>
          </div>
          <div className="automation-meta">
            <p><strong>Status:</strong> {unit.automation.running ? 'running' : 'idle'}</p>
            <p><strong>Active stage:</strong> {unit.automation.active_stage || 'none'}</p>
            <p><strong>Started:</strong> {unit.automation.start_time ? new Date(unit.automation.start_time).toLocaleString() : '—'}</p>
            <p><strong>Ended:</strong> {unit.automation.end_time ? new Date(unit.automation.end_time).toLocaleString() : '—'}</p>
            <p><strong>Last result:</strong> {unit.automation.last_execution_result}</p>
          </div>
        </article>

        <article className="panel context-panel">
          <div className="panel-header"><h2>Input Context Panel</h2></div>
          <p><strong>Project summary:</strong> {unit.context.project_summary}</p>
          <p><strong>Style profile summary:</strong> {unit.context.style_profile_summary}</p>
          <p><strong>Tone profile summary:</strong> {unit.context.tone_profile_summary}</p>
          <p><strong>Reference excerpts:</strong> {unit.context.reference_excerpts}</p>
          <p><strong>Relevant memory:</strong> {unit.context.relevant_memory}</p>
          <p><strong>Previous stage summary:</strong> {unit.context.previous_output_summary}</p>
          <p><strong>Director notes:</strong> {unit.director_notes}</p>
          <div className="context-previous">
            <h3>Previous stage outputs</h3>
            {contextFeed.length === 0 ? <p className="empty">No upstream outputs yet.</p> : contextFeed.map((item) => (
              <details key={item.label} open>
                <summary>{item.label}</summary>
                <pre>{JSON.stringify(item.output, null, 2)}</pre>
              </details>
            ))}
          </div>
        </article>
      </section>

      <section className="panel outputs-panel">
        <div className="panel-header"><h2>Role Output Panels</h2></div>
        {stages.map((s) => (
          <details key={s.key} open>
            <summary><span>{s.role}</span><small>{unit.stage_status[s.key]}</small></summary>
            <div className="output-fields">
              {(OUTPUT_FIELDS[s.key] || []).map((field) => (
                <label key={field}>{OUTPUT_LABELS[field]}
                  <textarea value={unit.stage_outputs[s.key]?.[field] || ''} onChange={(e) => updateOutput(s.key, field, e.target.value)} placeholder={`No ${OUTPUT_LABELS[field].toLowerCase()} yet.`} />
                </label>
              ))}
              <div className="field-actions">
                <button type="button" onClick={() => { appendLog('output_saved', `${s.key} output saved.`); }}>Save Output</button>
                <button type="button" onClick={() => runSingleStage(s.key)}>Auto-generate Output</button>
              </div>
            </div>
          </details>
        ))}
      </section>

      <section className="workspace-grid">
        <article className="panel log-panel">
          <div className="panel-header"><h2>Logs Panel</h2></div>
          <ul>
            {unit.execution_logs.map((log, i) => (
              <li key={`${log.timestamp}-${i}`}>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span><strong>{log.type}</strong>
                <p>{log.message}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel director-panel">
          <div className="panel-header"><h2>Director Review Panel</h2></div>
          <p>Decision state: <strong>{unit.director_decision}</strong></p>
          <div className="director-actions">
            <button type="button" onClick={() => directorAction('approve')}>Approve</button>
            <button type="button" onClick={() => directorAction('conditionally_approve')}>Conditionally Approve</button>
            <button type="button" onClick={() => directorAction('reject')}>Reject</button>
          </div>
          <label>Revision target stage
            <select value={revisionTarget} onChange={(e) => setRevisionTarget(e.target.value)}>
              {stages.filter((s) => s.key !== 'director_review').map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
          <label>Revision reason
            <textarea value={revisionReason} onChange={(e) => setRevisionReason(e.target.value)} placeholder="Describe revision requirements." />
          </label>
        </article>
      </section>

      <section className="panel translation-panel">
        <div className="panel-header"><h2>Optional Translation Task Panel</h2></div>
        <p className="translation-note">Translation is separate from the default production workflow and runs only on explicit request.</p>
        <div className="translation-grid">
          <label>Request type
            <select value={translationScope} onChange={(e) => setTranslationScope(e.target.value)}>
              <option value="full_project">Translate full project</option>
              <option value="chapter_episode">Translate chapter/episode</option>
              <option value="excerpt">Translate excerpt</option>
              <option value="synopsis">Localize synopsis</option>
              <option value="pitching_version">Create English pitching version</option>
            </select>
          </label>
          <label>Target language
            <select value={translationTarget} onChange={(e) => setTranslationTarget(e.target.value)}>
              <option>English</option>
              <option>Japanese</option>
              <option>Chinese</option>
              <option>Spanish</option>
            </select>
          </label>
          <button type="button" onClick={requestTranslation}>Request Translation Task</button>
        </div>
        <div className="translation-list">
          {unit.translation_requests.length === 0 ? <p className="empty">No translation tasks requested.</p> : unit.translation_requests.map((t) => (
            <article key={t.id}><p><strong>{t.scope}</strong> → {t.target}</p><p>{t.status} · {new Date(t.created_at).toLocaleString()}</p></article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => { setSession(existingSession); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); if (!nextSession) setPreviewMode(false); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setPreviewMode(false);
    if (!supabase) { setSession(null); return; }
    await supabase.auth.signOut();
  };

  if (loading) return <main className="loading-state">Loading Core Production Workspace...</main>;

  return (
    <main className="app-shell">
      {!session && !previewMode
        ? <AuthPanel onAuthenticated={() => undefined} onPreview={() => setPreviewMode(true)} />
        : <ProductionWorkspace user={session?.user} onSignOut={handleSignOut} />}
    </main>
  );
}
