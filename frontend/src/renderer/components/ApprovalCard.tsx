// ApprovalCard — HITL confirmation gate before write operations (§6.3)
import React, { useState } from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';

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
  // SDK limitation: PermissionRequestResult doesn't support passing back
  // modified arguments. The Edit button is removed per spec §5.6.
  const [showArgs, setShowArgs] = useState(false);

  return (
    <div className="approval-card">
      <div className="approval-header">
        <ShieldAlert size={16} className="approval-icon" />
        <span className="approval-title">Approval Required</span>
      </div>
      <div className="approval-body">
        <p className="approval-message">{message}</p>
        <div className="approval-tool">
          Tool: <strong>{toolName || 'unknown'}</strong>
        </div>

        {/* Diff preview table */}
        {diffPreview && diffPreview.length > 0 && (
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

        {/* Proposed args (fallback when no diff preview is available) */}
        {!diffPreview && proposedArgs && Object.keys(proposedArgs).length > 0 && (
          showArgs
            ? <pre className="approval-args">{JSON.stringify(proposedArgs, null, 2)}</pre>
            : <button className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setShowArgs(true)}>Show raw args</button>
        )}
      </div>
      <div className="approval-actions">
        <button className="btn-primary" onClick={() => onApprove()}>
          <Check size={14} /> Approve
        </button>
        <button className="btn-secondary" onClick={onSkip}>
          <X size={14} /> Skip
        </button>
      </div>
    </div>
  );
}
