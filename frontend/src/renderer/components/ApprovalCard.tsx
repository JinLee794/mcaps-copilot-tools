// ApprovalCard — HITL confirmation gate before write operations (§6.3)
import React, { useState } from 'react';
import { ShieldAlert, Check, Pencil, X } from 'lucide-react';

interface DiffRow {
  field: string;
  before: string;
  after: string;
}

interface ApprovalCardProps {
  message: string;
  toolName: string;
  proposedArgs?: Record<string, unknown>;
  diffPreview?: DiffRow[];
  onApprove: (editedArgs?: Record<string, unknown>) => void;
  onSkip: () => void;
}

export function ApprovalCard({
  message,
  toolName,
  proposedArgs,
  diffPreview,
  onApprove,
  onSkip,
}: ApprovalCardProps) {
  const [editing, setEditing] = useState(false);
  const [editedJson, setEditedJson] = useState(() =>
    proposedArgs ? JSON.stringify(proposedArgs, null, 2) : '',
  );
  const [parseError, setParseError] = useState<string | null>(null);

  const handleEditApprove = () => {
    try {
      const parsed = JSON.parse(editedJson) as Record<string, unknown>;
      setParseError(null);
      onApprove(parsed);
    } catch {
      setParseError('Invalid JSON');
    }
  };

  return (
    <div className="approval-card">
      <div className="approval-header">
        <ShieldAlert size={16} className="approval-icon" />
        <span className="approval-title">Approval Required</span>
      </div>
      <div className="approval-body">
        <p className="approval-message">{message}</p>
        <div className="approval-tool">
          Tool: <strong>{toolName}</strong>
        </div>

        {/* Diff preview table */}
        {diffPreview && diffPreview.length > 0 && !editing && (
          <table className="approval-diff-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              {diffPreview.map((row) => (
                <tr key={row.field}>
                  <td className="diff-field">{row.field}</td>
                  <td className="diff-before">{row.before}</td>
                  <td className="diff-after">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Proposed args (fallback when no diff, or when editing) */}
        {editing ? (
          <div>
            <textarea
              className="approval-args-editor"
              value={editedJson}
              onChange={(e) => { setEditedJson(e.target.value); setParseError(null); }}
              rows={8}
              spellCheck={false}
            />
            {parseError && (
              <div style={{ color: 'var(--accent-red)', fontSize: 11, marginTop: 4 }}>
                {parseError}
              </div>
            )}
          </div>
        ) : (
          !diffPreview && proposedArgs && (
            <pre className="approval-args">{JSON.stringify(proposedArgs, null, 2)}</pre>
          )
        )}
      </div>
      <div className="approval-actions">
        <button className="btn-primary" onClick={() => editing ? handleEditApprove() : onApprove()}>
          <Check size={14} /> {editing ? 'Save & Approve' : 'Approve'}
        </button>
        {proposedArgs && !editing && (
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Edit
          </button>
        )}
        {editing && (
          <button className="btn-secondary" onClick={() => { setEditing(false); setParseError(null); }}>
            Cancel Edit
          </button>
        )}
        <button className="btn-secondary" onClick={onSkip}>
          <X size={14} /> Skip
        </button>
      </div>
    </div>
  );
}
