// SkillEditor — split-pane SKILLS.md editor + preview (§5.5)
//
// Left pane: raw markdown editor (textarea)
// Right pane: live preview of parsed skill definition
// Supports save via IPC skill:save channel.

import React, { useState, useCallback, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Markdown from 'react-markdown';
import { parseSkillFile } from '../../shared/skills-parser';

declare global {
  interface Window {
    electronAPI: import('../../main/preload').ElectronAPI;
  }
}

interface SkillEditorProps {
  skillId: string;
  initialContent: string;
  onClose: () => void;
  onSave?: (skillId: string, content: string) => void;
}

export function SkillEditor({ skillId, initialContent, onClose, onSave }: SkillEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const parsed = parseSkillFile(content, `${skillId}.md`);

  useEffect(() => {
    setContent(initialContent);
    setDirty(false);
  }, [initialContent]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await window.electronAPI.skills.save(skillId, content);
      setDirty(false);
      onSave?.(skillId, content);
    } finally {
      setSaving(false);
    }
  }, [skillId, content, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  return (
    <div className="skill-editor-overlay" onKeyDown={handleKeyDown}>
      <div className="skill-editor">
        {/* Header */}
        <div className="skill-editor-header">
          <div className="skill-editor-title">
            <span>Edit Skill: {parsed?.name ?? skillId}</span>
            {dirty && <span className="skill-editor-dirty">● Modified</span>}
          </div>
          <div className="skill-editor-actions">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving || !dirty}
              style={{ width: 'auto', padding: '4px 12px' }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              className="btn-secondary"
              onClick={onClose}
              style={{ width: 'auto', padding: '4px 12px' }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Split pane */}
        <div className="skill-editor-body">
          {/* Left: raw editor */}
          <div className="skill-editor-pane skill-editor-source">
            <div className="skill-editor-pane-header">Source</div>
            <textarea
              className="skill-editor-textarea"
              value={content}
              onChange={handleChange}
              spellCheck={false}
            />
          </div>

          {/* Right: parsed preview */}
          <div className="skill-editor-pane skill-editor-preview">
            <div className="skill-editor-pane-header">Preview</div>
            <div className="skill-editor-preview-content">
              {parsed ? (
                <>
                  {/* Frontmatter fields */}
                  <div className="skill-preview-meta">
                    <div className="skill-preview-field">
                      <label>Name</label>
                      <span>{parsed.name}</span>
                    </div>
                    <div className="skill-preview-field">
                      <label>Description</label>
                      <span>{parsed.description}</span>
                    </div>
                    {parsed.argumentHint && (
                      <div className="skill-preview-field">
                        <label>Argument Hint</label>
                        <span>{parsed.argumentHint}</span>
                      </div>
                    )}
                    {parsed.mcpTools.length > 0 && (
                      <div className="skill-preview-field">
                        <label>MCP Tools ({parsed.mcpTools.length})</label>
                        <div className="skill-preview-tools">
                          {parsed.mcpTools.map((t) => (
                            <span key={t} className="tool-badge">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {parsed.flows.length > 0 && (
                      <div className="skill-preview-field">
                        <label>Flows ({parsed.flows.length})</label>
                        <ul className="skill-preview-flows">
                          {parsed.flows.map((f) => (
                            <li key={f.name}>
                              <strong>{f.name}</strong>
                              {f.steps.length > 0 && (
                                <span className="flow-step-count"> ({f.steps.length} steps)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Body markdown */}
                  <div className="skill-preview-body markdown-body">
                    <Markdown>{parsed.systemPrompt}</Markdown>
                  </div>
                </>
              ) : (
                <div className="skill-preview-error">
                  <AlertTriangle size={16} className="inline-icon" /> Could not parse skill file. Ensure YAML frontmatter is present
                  with at least a <code>name</code> field.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
