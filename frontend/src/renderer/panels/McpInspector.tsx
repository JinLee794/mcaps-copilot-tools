// MCP Tool Inspector — modal overlay showing active servers and tools (§5.4)
import React, { useState, useEffect } from 'react';
import { X, Circle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToolRegistry } from '../hooks/useToolRegistry';

interface McpInspectorProps {
  onClose: () => void;
}

export function McpInspector({ onClose }: McpInspectorProps) {
  const { tools, servers } = useToolRegistry();

  // Group tools by server
  const toolsByServer = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    if (!acc[tool.server]) acc[tool.server] = [];
    acc[tool.server].push(tool);
    return acc;
  }, {});

  // Categorize msx-crm tools
  const categorize = (name: string) => {
    const writeTools = ['create_task', 'update_task', 'close_task', 'update_milestone'];
    const authTools = ['crm_auth_status', 'crm_whoami', 'crm_login'];
    const viewTools = ['view_milestone_timeline', 'view_opportunity_cost_trend', 'view_staged_changes_diff'];
    if (writeTools.includes(name)) return 'WRITE (live)';
    if (authTools.includes(name)) return 'AUTH';
    if (viewTools.includes(name)) return 'VIEW';
    return 'READ';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">MCP Tool Inspector</span>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            CONFIG: .vscode/mcp.json
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Active Servers ({servers.length})
          </div>

          {Object.entries(toolsByServer).map(([serverName, serverTools]) => (
            <div key={serverName} className="server-card">
              <div className="server-card-header">
                <Circle size={10} fill="var(--accent-green)" color="var(--accent-green)" />
                <span className="server-name">{serverName}</span>
                <span className="server-type">
                  STDIO · <CheckCircle2 size={12} className="inline-icon" /> {serverTools.length} tools
                </span>
              </div>
              <div className="server-tools">
                {serverName === 'msx-crm' ? (
                  <>
                    {['READ', 'VIEW', 'WRITE (live)', 'AUTH'].map((category) => {
                      const catTools = serverTools.filter((t) => categorize(t.name) === category);
                      if (catTools.length === 0) return null;
                      return (
                        <div key={category} style={{ marginBottom: 4 }}>
                          <span className="tool-category">{category}: </span>
                          {catTools.map((t) => t.name).join(' · ')}
                        </div>
                      );
                    })}
                    <div className="write-warning">
                      <AlertTriangle size={14} className="inline-icon" /> Write tools are LIVE — HITL required BEFORE invocation
                    </div>
                  </>
                ) : (
                  serverTools.map((t) => (
                    <div key={t.name}>
                      {t.name} — {t.description}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
