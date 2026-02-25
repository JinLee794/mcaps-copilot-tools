// Renderer entry — three-panel layout with IPC-based transport (§4, §8)
import React from 'react';
import { SkillsPanel } from './panels/SkillsPanel';
import { ResearchCanvas } from './panels/ResearchCanvas';
import { AgentChat } from './panels/AgentChat';
import { McpInspector } from './panels/McpInspector';
import { AgUiTransportProvider, useAgUiTransport } from './hooks/useAgUiTransport';
import './styles/index.css';

function AppShell() {
  const [showMcpInspector, setShowMcpInspector] = React.useState(false);
  const transport = useAgUiTransport();

  return (
      <div className="app-shell">
        {/* Header bar */}
        <header className="app-header">
          <div className="header-left">
            <span className="app-logo">◉</span>
            <h1 className="app-title">Copilot Sales Assistant</h1>
          </div>
          <div className="header-right">
            <span className="connection-status">
              <span className={`status-dot ${transport.connected ? 'connected' : 'disconnected'}`} />
              {transport.connected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </header>

        {/* Three-panel layout: Skills 20% · Canvas 50% · Chat 30% */}
        <main className="panels-container">
          <div className="panel panel-skills">
            <SkillsPanel onOpenMcpInspector={() => setShowMcpInspector(true)} />
          </div>
          <div className="panel panel-canvas">
            <ResearchCanvas />
          </div>
          <div className="panel panel-chat">
            <AgentChat />
          </div>
        </main>

        {/* Status bar */}
        <footer className="status-bar">
          <span className="status-item" onClick={() => setShowMcpInspector(true)}>
            ⬤ mcp.json: {transport.toolCalls.length} tool calls
          </span>
          <span className="status-item">
            ● Copilot CLI {transport.connected ? 'connected' : 'disconnected'}
          </span>
          <span className="status-item">
            Status: {transport.state.status}
          </span>
        </footer>

        {/* MCP Inspector modal */}
        {showMcpInspector && (
          <McpInspector onClose={() => setShowMcpInspector(false)} />
        )}
      </div>
  );
}

export default function App() {
  return (
    <AgUiTransportProvider>
      <AppShell />
    </AgUiTransportProvider>
  );
}
