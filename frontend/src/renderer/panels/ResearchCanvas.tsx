// Research Canvas — live data source nodes + correlation + output (§5.2)
import React, { useMemo } from 'react';
import { Mail, Mic, MessageSquare, FolderOpen, Building2, ClipboardList, X } from 'lucide-react';
import { SourceNodeCard } from '../components/SourceNode';
import { OutputPanel } from '../components/OutputPanel';
import { CorrelationGraph } from '../components/CorrelationGraph';
import type { CorrelationEdge } from '../components/CorrelationGraph';
import { useAgentState } from '../hooks/useAgUiTransport';

export function ResearchCanvas() {
  const { state } = useAgentState();

  // Convert correlation signals to graph edges
  const edges = useMemo<CorrelationEdge[]>(() =>
    state.correlations.signals
      .filter((s): s is typeof s & { target: string } => !!s.source && !!s.target)
      .map((s) => ({
        from: s.source,
        to: s.target,
        strength: s.strength ?? 0.5,
        label: s.label,
      })),
    [state.correlations.signals],
  );

  // Map state momentum to graph momentum
  const graphMomentum = state.correlations.momentum === 'growing' ? 'accelerating' as const
    : state.correlations.momentum === 'declining' ? 'stalled' as const
    : 'steady' as const;

  const statusClass = state.status === 'idle' ? 'idle'
    : state.status === 'running' ? 'running'
    : state.status === 'complete' ? 'complete'
    : state.status === 'error' ? 'error'
    : 'idle';

  return (
    <>
      <div className="panel-header">
        <span>Research Canvas</span>
        {state.status === 'running' && (
          <button className="btn-secondary" style={{ width: 'auto', padding: '2px 8px', marginTop: 0 }}>
            <X size={14} /> Cancel
          </button>
        )}
      </div>
      <div className="panel-content">
        {/* Status bar */}
        <div className="canvas-status">
          <span className={`canvas-status-dot ${statusClass}`} />
          <span>
            {state.status === 'idle' && 'Ready — select a skill to begin'}
            {state.status === 'running' && `Running: ${state.skill}`}
            {state.status === 'complete' && 'Output complete'}
            {state.status === 'error' && 'Error occurred'}
            {state.status === 'paused' && 'Paused — awaiting approval'}
          </span>
        </div>

        {/* Progress bar */}
        {state.status === 'running' && (
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${state.progress}%` }} />
          </div>
        )}

        {/* Data source nodes — 2-column grid */}
        <div className="source-nodes">
          {/* WorkIQ sources */}
          <SourceNodeCard icon={<Mail size={16} />} title="Emails" node={state.sources.emails} />
          <SourceNodeCard icon={<Mic size={16} />} title="Transcripts" node={state.sources.transcripts} />
          <SourceNodeCard icon={<MessageSquare size={16} />} title="Teams" node={state.sources.teams} />
          <SourceNodeCard icon={<FolderOpen size={16} />} title="SharePoint" node={state.sources.sharepoint} />

          {/* MSX/CRM sources */}
          <SourceNodeCard icon={<Building2 size={16} />} title="Milestones" node={state.sources.milestones} />
          <SourceNodeCard icon={<ClipboardList size={16} />} title="Tasks" node={state.sources.tasks} />
        </div>

        {/* Correlation graph overlay */}
        {edges.length > 0 && (
          <CorrelationGraph
            edges={edges}
            riskLevel={state.correlations.riskLevel}
            momentum={graphMomentum}
          />
        )}

        {/* Correlation summary */}
        {state.correlations.signals.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              Correlation Engine
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              <span>Risk: <strong style={{ color: state.correlations.riskLevel === 'high' ? 'var(--accent-red)' : state.correlations.riskLevel === 'medium' ? 'var(--accent-amber)' : 'var(--accent-green)' }}>{state.correlations.riskLevel}</strong></span>
              <span>Momentum: <strong>{state.correlations.momentum}</strong></span>
            </div>
            {state.correlations.champions.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                Champions: {state.correlations.champions.map((c) => c.name).join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Output panel */}
        <OutputPanel
          markdown={state.output.markdown}
          citations={state.output.citations.map((c, i) => ({ id: String(i + 1), source: c.source, excerpt: c.ref }))}
          status={state.output.status}
        />
      </div>
    </>
  );
}
