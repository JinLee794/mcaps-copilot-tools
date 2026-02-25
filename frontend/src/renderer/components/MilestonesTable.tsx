// MilestonesTable — editable table for milestones + nested tasks (rsuite-inspired)
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Plus, Check, X, Pencil, Calendar,
  AlertCircle, Clock, CheckCircle2, CircleDot, Ban,
} from 'lucide-react';
import type { CrmMilestone, CrmTask } from '../../shared/types/SalesAgentState';

// ── Status maps ────────────────────────────────────────────────────

const MILESTONE_STATUS_LABELS: Record<number, string> = {
  861980000: 'On Track',
  861980001: 'At Risk',
  861980002: 'Blocked',
  861980003: 'Completed',
  861980004: 'Not Started',
  861980005: 'Cancelled',
};

const MILESTONE_STATUS_CLASS: Record<number, string> = {
  861980000: 'on-track',
  861980001: 'at-risk',
  861980002: 'blocked',
  861980003: 'completed',
  861980004: 'not-started',
  861980005: 'cancelled',
};

const TASK_STATUS_LABELS: Record<number, string> = {
  2: 'Not Started',
  3: 'In Progress',
  4: 'Waiting',
  5: 'Completed',
  6: 'Canceled',
  7: 'Deferred',
};

const TASK_CATEGORIES: Array<{ label: string; value: number }> = [
  { label: 'Technical Close/Win Plan', value: 606820005 },
  { label: 'Architecture Design Session', value: 861980004 },
  { label: 'Blocker Escalation', value: 861980006 },
  { label: 'Briefing', value: 861980008 },
  { label: 'Consumption Plan', value: 861980007 },
  { label: 'Demo', value: 861980002 },
  { label: 'PoC/Pilot', value: 861980005 },
  { label: 'Workshop', value: 861980001 },
];

// ── Icon helper ────────────────────────────────────────────────────

function StatusIcon({ status }: { status: number }) {
  switch (status) {
    case 861980000: return <CheckCircle2 size={14} className="status-icon on-track" />;
    case 861980001: return <AlertCircle size={14} className="status-icon at-risk" />;
    case 861980002: return <Ban size={14} className="status-icon blocked" />;
    case 861980003: return <Check size={14} className="status-icon completed" />;
    case 861980004: return <Clock size={14} className="status-icon not-started" />;
    default:        return <CircleDot size={14} className="status-icon" />;
  }
}

// ── Inline editable cell ───────────────────────────────────────────

interface EditableCellProps {
  value: string;
  onCommit: (newValue: string) => void;
  type?: 'text' | 'date';
  placeholder?: string;
}

function EditableCell({ value, onCommit, type = 'text', placeholder }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    if (draft !== value) onCommit(draft);
  }, [draft, value, onCommit]);

  const cancel = useCallback(() => {
    setEditing(false);
    setDraft(value);
  }, [value]);

  if (!editing) {
    return (
      <span className="editable-cell" onClick={() => { setDraft(value); setEditing(true); }}>
        {value || <span className="placeholder">{placeholder ?? '—'}</span>}
        <Pencil size={10} className="edit-hint" />
      </span>
    );
  }

  return (
    <span className="editable-cell editing">
      <input
        ref={inputRef}
        className="cell-input"
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
        onBlur={commit}
      />
    </span>
  );
}

// ── Select cell (for dropdowns) ────────────────────────────────────

interface SelectCellProps {
  value: number | null;
  options: Array<{ label: string; value: number }>;
  onCommit: (newValue: number) => void;
  formatter?: (v: number | null) => string;
}

function SelectCell({ value, options, onCommit, formatter }: SelectCellProps) {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  const displayValue = formatter ? formatter(value) : (value != null ? String(value) : '—');

  if (!editing) {
    return (
      <span className="editable-cell" onClick={() => setEditing(true)}>
        {displayValue}
        <Pencil size={10} className="edit-hint" />
      </span>
    );
  }

  return (
    <span className="editable-cell editing">
      <select
        ref={selectRef}
        className="cell-select"
        value={value ?? ''}
        onChange={(e) => {
          const v = Number(e.target.value);
          setEditing(false);
          onCommit(v);
        }}
        onBlur={() => setEditing(false)}
      >
        <option value="" disabled>Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </span>
  );
}

// ── New Task Row ───────────────────────────────────────────────────

interface NewTaskDraft {
  subject: string;
  scheduledend: string;
  category: number | null;
}

function NewTaskRow({ onSave, onCancel }: {
  onSave: (draft: NewTaskDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<NewTaskDraft>({ subject: '', scheduledend: '', category: null });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <tr className="task-row new-task-row">
      <td className="cell-indent" />
      <td>
        <input
          ref={inputRef}
          className="cell-input"
          placeholder="Task subject…"
          value={draft.subject}
          onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && draft.subject.trim()) onSave(draft);
            if (e.key === 'Escape') onCancel();
          }}
        />
      </td>
      <td>
        <select
          className="cell-select"
          value={draft.category ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value ? Number(e.target.value) : null }))}
        >
          <option value="">Category…</option>
          {TASK_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          className="cell-input"
          type="date"
          value={draft.scheduledend}
          onChange={(e) => setDraft((d) => ({ ...d, scheduledend: e.target.value }))}
        />
      </td>
      <td />
      <td className="cell-actions">
        <button
          className="btn-icon btn-confirm"
          disabled={!draft.subject.trim()}
          onClick={() => onSave(draft)}
          title="Add task"
        >
          <Check size={14} />
        </button>
        <button className="btn-icon btn-cancel" onClick={onCancel} title="Cancel">
          <X size={14} />
        </button>
      </td>
    </tr>
  );
}

// ── Main table ─────────────────────────────────────────────────────

export interface MilestoneWithTasks extends CrmMilestone {
  _tasks?: CrmTask[];
}

export interface MilestonesTableProps {
  milestones: MilestoneWithTasks[];
  onUpdateTask: (taskId: string, milestoneId: string, changes: Record<string, unknown>) => void;
  onCreateTask: (milestoneId: string, task: { subject: string; scheduledend: string; category: number | null }) => void;
  loading?: boolean;
}

export function MilestonesTable({ milestones, onUpdateTask, onCreateTask, loading }: MilestonesTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingTaskFor, setAddingTaskFor] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="ms-table-loading">
        <Clock size={24} className="spin" />
        <span>Loading milestones…</span>
      </div>
    );
  }

  if (!milestones.length) {
    return (
      <div className="ms-table-empty">
        <Calendar size={24} />
        <span>No milestones loaded. Use the chat to query milestones for a customer.</span>
      </div>
    );
  }

  return (
    <div className="ms-table-wrapper">
      <table className="ms-table">
        <thead>
          <tr>
            <th className="col-expand" />
            <th className="col-name">Name</th>
            <th className="col-category">Category</th>
            <th className="col-date">Date</th>
            <th className="col-status">Status</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((ms) => {
            const msId = ms.msp_engagementmilestoneid;
            const isExpanded = expanded.has(msId);
            const tasks = ms._tasks ?? [];
            const statusLabel = ms['msp_milestonestatus@OData.Community.Display.V1.FormattedValue']
              ?? MILESTONE_STATUS_LABELS[ms.msp_milestonestatus] ?? 'Unknown';
            const statusClass = MILESTONE_STATUS_CLASS[ms.msp_milestonestatus] ?? '';
            const dateStr = ms.msp_milestonedate
              ? new Date(ms.msp_milestonedate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : '—';
            const categoryLabel = ms['msp_milestonecategory@OData.Community.Display.V1.FormattedValue'] ?? '—';

            return (
              <React.Fragment key={msId}>
                {/* Milestone row */}
                <tr className={`milestone-row ${isExpanded ? 'expanded' : ''}`}>
                  <td className="cell-expand" onClick={() => toggleExpand(msId)}>
                    {isExpanded
                      ? <ChevronDown size={14} />
                      : <ChevronRight size={14} />}
                  </td>
                  <td className="cell-name">
                    <span className="ms-number">{ms.msp_milestonenumber}</span>
                    <span className="ms-title">{ms.msp_name}</span>
                  </td>
                  <td className="cell-category">{categoryLabel}</td>
                  <td className="cell-date">
                    <Calendar size={12} className="inline-icon" /> {dateStr}
                  </td>
                  <td className="cell-status">
                    <span className={`status-badge ${statusClass}`}>
                      <StatusIcon status={ms.msp_milestonestatus} />
                      {statusLabel}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
                    <button
                      className="btn-icon btn-add"
                      onClick={() => { setExpanded((s) => new Set(s).add(msId)); setAddingTaskFor(msId); }}
                      title="Add task"
                    >
                      <Plus size={14} />
                    </button>
                  </td>
                </tr>

                {/* Task rows (when expanded) */}
                {isExpanded && tasks.map((task) => {
                  const taskStatusLabel = task['statuscode@OData.Community.Display.V1.FormattedValue']
                    ?? TASK_STATUS_LABELS[task.statuscode] ?? 'Unknown';
                  const taskCategoryLabel = task['msp_taskcategory@OData.Community.Display.V1.FormattedValue']
                    ?? TASK_CATEGORIES.find((c) => c.value === task.msp_taskcategory)?.label ?? '—';
                  const taskDate = task.scheduledend
                    ? task.scheduledend.split('T')[0]
                    : '';

                  return (
                    <tr key={task.activityid} className="task-row">
                      <td className="cell-indent" />
                      <td>
                        <EditableCell
                          value={task.subject}
                          onCommit={(v) => onUpdateTask(task.activityid, msId, { subject: v })}
                          placeholder="Task subject"
                        />
                      </td>
                      <td>
                        <SelectCell
                          value={task.msp_taskcategory}
                          options={TASK_CATEGORIES}
                          onCommit={(v) => onUpdateTask(task.activityid, msId, { msp_taskcategory: v })}
                          formatter={() => taskCategoryLabel}
                        />
                      </td>
                      <td>
                        <EditableCell
                          value={taskDate}
                          type="date"
                          onCommit={(v) => onUpdateTask(task.activityid, msId, { scheduledend: v })}
                          placeholder="Due date"
                        />
                      </td>
                      <td>
                        <SelectCell
                          value={task.statuscode}
                          options={Object.entries(TASK_STATUS_LABELS).map(([v, l]) => ({
                            value: Number(v), label: l,
                          }))}
                          onCommit={(v) => onUpdateTask(task.activityid, msId, { statuscode: v })}
                          formatter={() => taskStatusLabel}
                        />
                      </td>
                      <td />
                    </tr>
                  );
                })}

                {/* New task row */}
                {isExpanded && addingTaskFor === msId && (
                  <NewTaskRow
                    onSave={(draft) => {
                      onCreateTask(msId, draft);
                      setAddingTaskFor(null);
                    }}
                    onCancel={() => setAddingTaskFor(null)}
                  />
                )}

                {/* Empty state when expanded but no tasks */}
                {isExpanded && tasks.length === 0 && addingTaskFor !== msId && (
                  <tr className="task-row empty-tasks">
                    <td className="cell-indent" />
                    <td colSpan={5} className="empty-tasks-label">
                      No tasks yet.{' '}
                      <button className="link-btn" onClick={() => setAddingTaskFor(msId)}>
                        Add one
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
