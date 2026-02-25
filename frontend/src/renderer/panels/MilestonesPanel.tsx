// Milestones Panel — editable milestone + task table, driven by AG-UI state (§5.4)
import React, { useCallback, useMemo, useState } from 'react';
import { ClipboardList, RefreshCw, Filter } from 'lucide-react';
import { MilestonesTable } from '../components/MilestonesTable';
import type { MilestoneWithTasks } from '../components/MilestonesTable';
import { useAgentState } from '../hooks/useAgUiTransport';
import type { CrmMilestone, CrmTask } from '../../shared/types/SalesAgentState';

type StatusFilter = 'all' | 'active' | 'completed';

/**
 * Groups tasks by milestone using _regardingobjectid_value.
 */
function buildMilestoneRows(
  milestones: CrmMilestone[],
  tasks: CrmTask[],
  filter: StatusFilter,
): MilestoneWithTasks[] {
  const tasksByMs = new Map<string, CrmTask[]>();
  for (const t of tasks) {
    const msId = t._regardingobjectid_value;
    if (!msId) continue;
    const arr = tasksByMs.get(msId) ?? [];
    arr.push(t);
    tasksByMs.set(msId, arr);
  }

  let filtered = milestones;
  if (filter === 'active') {
    // On Track, At Risk, Blocked, Not Started
    const activeStatuses = new Set([861980000, 861980001, 861980002, 861980004]);
    filtered = milestones.filter((m) => activeStatuses.has(m.msp_milestonestatus));
  } else if (filter === 'completed') {
    filtered = milestones.filter((m) => m.msp_milestonestatus === 861980003);
  }

  return filtered.map((ms) => ({
    ...ms,
    _tasks: tasksByMs.get(ms.msp_engagementmilestoneid) ?? [],
  }));
}

export function MilestonesPanel() {
  const { state } = useAgentState();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  const milestones = state.sources.milestones.records ?? [];
  const tasks = state.sources.tasks.records ?? [];
  const loading = state.sources.milestones.status === 'loading';

  const rows = useMemo(
    () => buildMilestoneRows(milestones, tasks, statusFilter),
    [milestones, tasks, statusFilter],
  );

  const handleRefresh = useCallback(async () => {
    if (!window.electronAPI) return;
    await window.electronAPI.copilot.run({
      skill: 'milestone-hygiene',
      prompt: 'refresh milestones',
      context: {},
    });
  }, []);

  const handleUpdateTask = useCallback(async (taskId: string, milestoneId: string, changes: Record<string, unknown>) => {
    if (!window.electronAPI) return;
    await window.electronAPI.copilot.run({
      skill: 'update-task',
      prompt: `Update task ${taskId} on milestone ${milestoneId}`,
      context: { taskId, milestoneId, changes },
    });
  }, []);

  const handleCreateTask = useCallback(async (milestoneId: string, task: { subject: string; scheduledend: string; category: number | null }) => {
    if (!window.electronAPI) return;
    await window.electronAPI.copilot.run({
      skill: 'create-task',
      prompt: `Create task "${task.subject}" on milestone ${milestoneId}`,
      context: { milestoneId, ...task },
    });
  }, []);

  return (
    <>
      <div className="panel-header">
        <span><ClipboardList size={16} className="inline-icon" /> Milestones</span>
        <div className="panel-header-actions">
          {/* Status filter */}
          <div className="filter-group">
            <Filter size={12} />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="btn-icon" onClick={handleRefresh} title="Refresh milestones">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div className="panel-content milestones-panel-content">
        <MilestonesTable
          milestones={rows}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          loading={loading}
        />
        {rows.length > 0 && (
          <div className="ms-table-footer">
            {rows.length} milestone{rows.length !== 1 ? 's' : ''} · {rows.reduce((n, m) => n + (m._tasks?.length ?? 0), 0)} tasks
          </div>
        )}
      </div>
    </>
  );
}
