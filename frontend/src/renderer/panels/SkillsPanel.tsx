// Skills Panel — skill list, tuner, run button, workflow registry (§5.1, §13.8)
import React, { useState, useCallback } from 'react';
import { useSkillLoader } from '../hooks/useSkillLoader';
import { SkillEditor } from '../components/SkillEditor';
import type { WorkflowRegistryEntry } from '../../shared/types/CapturedWorkflow';

declare global {
  interface Window {
    electronAPI: import('../../main/preload').ElectronAPI;
  }
}

type TabId = 'skills' | 'workflows';

interface SkillsPanelProps {
  onOpenMcpInspector: () => void;
}

export function SkillsPanel({ onOpenMcpInspector }: SkillsPanelProps) {
  const { skills, activeSkill, selectSkill, runSkill, isRunning } = useSkillLoader();
  const [activeTab, setActiveTab] = useState<TabId>('skills');
  const [editingSkill, setEditingSkill] = useState<{ id: string; content: string } | null>(null);
  const [runMode, setRunMode] = useState<'explore' | 'workflow'>('explore');
  const [workflows] = useState<WorkflowRegistryEntry[]>([]); // Populated from .copilot/workflows/
  const [tunerParams, setTunerParams] = useState({
    accountContext: '',
    timeWindow: '30d',
    depth: 2 as 1 | 2 | 3,
    outputFormat: 'Exec Summary',
  });
  const [prompt, setPrompt] = useState('');

  const handleRun = useCallback(() => {
    if (!activeSkill) return;
    runSkill(activeSkill.id, prompt || `Run ${activeSkill.name}`, tunerParams);
  }, [activeSkill, prompt, tunerParams, runSkill]);

  const handleEditSkill = useCallback(async () => {
    if (!activeSkill) return;
    const skill = await window.electronAPI.skills.load(activeSkill.id);
    if (skill && typeof skill === 'object' && 'rawContent' in skill) {
      setEditingSkill({ id: activeSkill.id, content: (skill as { rawContent: string }).rawContent });
    }
  }, [activeSkill]);

  return (
    <>
      <div className="panel-header">
        {/* Tab switcher */}
        <div className="panel-tabs">
          <button
            className={`panel-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            My Skills
          </button>
          <button
            className={`panel-tab ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflows')}
          >
            ⚡ Workflows
          </button>
        </div>
      </div>
      <div className="panel-content">
        {/* ── Skills Tab ─────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <>
            {/* Skill List */}
            <ul className="skill-list">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className={`skill-item ${activeSkill?.id === skill.id ? 'active' : ''}`}
                  onClick={() => selectSkill(skill.id)}
                >
                  <span className="skill-indicator" />
                  <span>{skill.name}</span>
                  <span className="skill-run-btn">▶ Run</span>
                </li>
              ))}
            </ul>

            {skills.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <div className="empty-state-text">
                  No skills found.<br />
                  Drop a SKILLS.md to get started.
                </div>
              </div>
            )}

            {/* Skill Tuner — shows when a skill is selected */}
            {activeSkill && (
              <div className="skill-tuner">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Skill Tuner — {activeSkill.name}
                </div>

                <div className="tuner-field">
                  <label className="tuner-label">Account context</label>
                  <input
                    className="tuner-input"
                    placeholder="Acme Corp (MSX-1029)"
                    value={tunerParams.accountContext}
                    onChange={(e) => setTunerParams((p) => ({ ...p, accountContext: e.target.value }))}
                  />
                </div>

                <div className="tuner-field">
                  <label className="tuner-label">Time window</label>
                  <select
                    className="tuner-select"
                    value={tunerParams.timeWindow}
                    onChange={(e) => setTunerParams((p) => ({ ...p, timeWindow: e.target.value }))}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="14d">Last 14 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>

                <div className="tuner-field">
                  <label className="tuner-label">Depth</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>Shallow</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      value={tunerParams.depth}
                      onChange={(e) => setTunerParams((p) => ({ ...p, depth: Number(e.target.value) as 1 | 2 | 3 }))}
                      style={{ flex: 1 }}
                    />
                    <span>Deep</span>
                  </div>
                </div>

                <div className="tuner-field">
                  <label className="tuner-label">Output format</label>
                  <select
                    className="tuner-select"
                    value={tunerParams.outputFormat}
                    onChange={(e) => setTunerParams((p) => ({ ...p, outputFormat: e.target.value }))}
                  >
                    <option>Exec Summary</option>
                    <option>Detailed Brief</option>
                    <option>Action Items Only</option>
                  </select>
                </div>

                {/* Run mode selector (§13.8) */}
                <div className="tuner-field">
                  <label className="tuner-label">Run mode</label>
                  <div className="run-mode-selector">
                    <label className="run-mode-option">
                      <input
                        type="radio"
                        name="runMode"
                        checked={runMode === 'explore'}
                        onChange={() => setRunMode('explore')}
                      />
                      LLM Explore
                    </label>
                    <label className="run-mode-option">
                      <input
                        type="radio"
                        name="runMode"
                        checked={runMode === 'workflow'}
                        onChange={() => setRunMode('workflow')}
                      />
                      ⚡ Workflow
                    </label>
                  </div>
                </div>

                <div className="tuner-field">
                  <label className="tuner-label">Custom prompt (optional)</label>
                  <input
                    className="tuner-input"
                    placeholder="Additional instructions..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <button className="btn-primary" onClick={handleRun} disabled={isRunning}>
                  {isRunning ? '⟳ Running...' : '▶ Run Skill'}
                </button>

                <button className="btn-secondary" onClick={handleEditSkill}>
                  ⚙ Edit SKILLS.md
                </button>

                <button className="btn-secondary" onClick={onOpenMcpInspector}>
                  🔌 MCP Tools
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Workflows Tab (§13.8) ──────────────────────────── */}
        {activeTab === 'workflows' && (
          <div className="workflows-registry">
            {workflows.length > 0 ? (
              <ul className="workflow-list">
                {workflows.map((wf) => (
                  <li key={wf.id} className="workflow-item">
                    <div className="workflow-item-header">
                      <span className="workflow-name">
                        {wf.starred && '★ '}
                        {wf.name}
                      </span>
                    </div>
                    <div className="workflow-item-meta">
                      Captured: {new Date(wf.capturedAt).toLocaleDateString()}
                      {' · '}Steps: {wf.stepsCount}
                      {' · '}Est: ~{Math.round(wf.estimatedDurationMs / 1000)}s
                    </div>
                    <div className="workflow-item-actions">
                      <button className="btn-primary" style={{ width: 'auto', padding: '2px 8px' }}>
                        ▶ Run
                      </button>
                      <button className="btn-secondary" style={{ width: 'auto', padding: '2px 8px' }}>
                        ✎ Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">⚡</div>
                <div className="empty-state-text">
                  No compiled workflows yet.<br />
                  Run a skill in Explore mode, then click "📸 Capture" to compile.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skill Editor Modal */}
      {editingSkill && (
        <SkillEditor
          skillId={editingSkill.id}
          initialContent={editingSkill.content}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </>
  );
}
