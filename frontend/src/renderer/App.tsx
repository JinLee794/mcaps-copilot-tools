// Renderer entry — three-panel layout with IPC-based transport (§4, §8)
import React from 'react';
import { Sparkles, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { AgentChat } from './panels/AgentChat';
import { McpInspector } from './panels/McpInspector';
import { AgUiTransportProvider, useAgUiTransport } from './hooks/useAgUiTransport';
import './styles/index.css';

function AppShell() {
  const [showMcpInspector, setShowMcpInspector] = React.useState(false);
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
            <span className="connection-status">
              <span className={`status-dot ${transport.connected ? 'connected' : 'disconnected'}`} />
              Copilot {transport.connected ? 'Connected' : 'Connecting...'}
            </span>
            <span className="connection-status">
              <span className="status-dot connected" />
              Azure
            </span>
            <button
              className="header-btn"
              onClick={handleAzRefresh}
              disabled={azRefreshing}
              title="Refresh Azure CLI credentials"
            >
              <RefreshCw size={14} className={azRefreshing ? 'spin' : ''} />
              {azRefreshing ? 'Signing in...' : 'Run az login'}
            </button>
            <button className="header-btn" onClick={() => setShowMcpInspector(true)} title="Open quick actions">
              <SlidersHorizontal size={14} />
              Quick Actions
            </button>
          </div>
        </header>

        <main className="panels-container single-chat-layout">
          <div className="panel panel-chat-full">
            <AgentChat />
          </div>
        </main>

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
