// Renderer entry — three-panel layout with IPC-based transport (§4, §8)
import React from 'react';
import { Sparkles, Server, Terminal, Activity, RefreshCw } from 'lucide-react';
import { SkillsPanel } from './panels/SkillsPanel';
import { ResearchCanvas } from './panels/ResearchCanvas';
import { AgentChat } from './panels/AgentChat';
import { McpInspector } from './panels/McpInspector';
import { MilestonesPanel } from './panels/MilestonesPanel';
import { AgUiTransportProvider, useAgUiTransport } from './hooks/useAgUiTransport';
import './styles/index.css';

type CanvasView = 'research' | 'milestones';

function AppShell() {
  const [showMcpInspector, setShowMcpInspector] = React.useState(false);
  const [canvasView, setCanvasView] = React.useState<CanvasView>('research');
  const [azRefreshing, setAzRefreshing] = React.useState(false);
  const transport = useAgUiTransport();

  const handleAzRefresh = async () => {
    setAzRefreshing(true);
    try {
      const result = await window.electronAPI.auth.azRefresh();
      if (!result.ok) console.error('az login failed:', result.error);
    } finally {
      setAzRefreshing(false);
    }
  };

  return (
      <div className="app-shell">
        {/* Header bar */}
        <header className="app-header">
          <div className="header-left">
            <Sparkles size={18} className="app-logo" />
            <h1 className="app-title">Copilot Sales Assistant</h1>
          </div>
          <div className="header-right">
            <button
              className="header-btn"
              onClick={handleAzRefresh}
              disabled={azRefreshing}
              title="Refresh Azure CLI credentials"
            >
              <RefreshCw size={14} className={azRefreshing ? 'spin' : ''} />
              {azRefreshing ? 'Signing in...' : 'Az Login'}
            </button>
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
            {/* Canvas view switcher */}
            <div className="canvas-tabs">
              <button
                className={`canvas-tab ${canvasView === 'research' ? 'active' : ''}`}
                onClick={() => setCanvasView('research')}
              >
                Research
              </button>
              <button
                className={`canvas-tab ${canvasView === 'milestones' ? 'active' : ''}`}
                onClick={() => setCanvasView('milestones')}
              >
                Milestones
              </button>
            </div>
            {canvasView === 'research' ? <ResearchCanvas /> : <MilestonesPanel />}
          </div>
          <div className="panel panel-chat">
            <AgentChat />
          </div>
        </main>

        {/* Status bar */}
        <footer className="status-bar">
          <span className="status-item" onClick={() => setShowMcpInspector(true)}>
            <Server size={12} /> mcp.json: {transport.toolCalls.length} tool calls
          </span>
          <span className="status-item">
            <Terminal size={12} /> Copilot CLI {transport.connected ? 'connected' : 'disconnected'}
          </span>
          <span className="status-item">
            <Activity size={12} /> {transport.state.status}
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
