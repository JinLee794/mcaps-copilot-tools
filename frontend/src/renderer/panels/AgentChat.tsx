// Agent Chat — unified message timeline with inline tool calls + HITL approval (§5.3)
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, Bot, SendHorizonal, Wrench, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronRight, Plus, History, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ApprovalCard } from '../components/ApprovalCard';
import { CliActivityStream } from '../components/CliActivityStream';
import { ToolResultView } from '../components/ToolResultView';
import { useAgentState, useAgUiEvents } from '../hooks/useAgUiTransport';
import type { ToolCallEntry } from '../components/ToolCallLog';
import type { ElectronAPI, SessionMeta } from '../../main/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type TimelineItem =
  | { kind: 'message'; data: ChatMessage }
  | { kind: 'tool-call'; data: ToolCallEntry };

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showSessionDrawer, setShowSessionDrawer] = useState(false);
  const [sessionList, setSessionList] = useState<SessionMeta[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useAgentState();
  const { toolCalls, interrupt, streamingText, cliActivity } = useAgUiEvents();

  // Track session ID from STATE_DELTA events
  useEffect(() => {
    if (state.sessionId) setActiveSessionId(state.sessionId as string);
    if (state.sessionTitle) setActiveSessionTitle(state.sessionTitle as string);
  }, [state.sessionId, state.sessionTitle]);

  // Append or update the assistant message as streaming text arrives
  useEffect(() => {
    if (!streamingText) return;
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg.id.startsWith('assistant-stream-')) {
        return prev.map((m) =>
          m.id === lastMsg.id ? { ...m, content: streamingText } : m,
        );
      }
      return [
        ...prev,
        {
          id: `assistant-stream-${Date.now()}`,
          role: 'assistant' as const,
          content: streamingText,
          timestamp: new Date(),
        },
      ];
    });
  }, [streamingText]);

  // Merge messages + tool calls into a chronological timeline
  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [
      ...messages.map((m) => ({ kind: 'message' as const, data: m })),
      ...toolCalls.map((tc) => ({ kind: 'tool-call' as const, data: tc })),
    ];
    items.sort((a, b) => a.data.timestamp.getTime() - b.data.timestamp.getTime());
    return items;
  }, [messages, toolCalls]);

  const isStreaming = state.status === 'running' && streamingText.length > 0;

  // Auto-scroll to bottom on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline, interrupt, streamingText]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (window.electronAPI) {
      await window.electronAPI.copilot.run({
        skill: state.skill || 'default',
        prompt: input,
        context: {},
      });
    }
  }, [input, state.skill]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleApprove = useCallback(async (editedArgs?: Record<string, unknown>) => {
    if (window.electronAPI) {
      await window.electronAPI.permission.respond({ approved: true, edits: editedArgs });
    }
  }, []);

  const handleSkip = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.permission.respond({ approved: false });
    }
  }, []);

  // Filter CLI activity to exclude tool events (shown inline in timeline)
  const filteredCliActivity = useMemo(
    () => cliActivity.filter((e) => e.kind !== 'tool_invoked' && e.kind !== 'tool_completed'),
    [cliActivity],
  );

  // Session management
  const handleNewSession = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.sessions.newSession();
      setMessages([]);
      setActiveSessionId(null);
      setActiveSessionTitle(null);
    }
  }, []);

  const loadSessionList = useCallback(async () => {
    if (window.electronAPI) {
      const { sessions } = await window.electronAPI.sessions.list();
      setSessionList(sessions);
    }
  }, []);

  const handleToggleSessionDrawer = useCallback(async () => {
    if (!showSessionDrawer) await loadSessionList();
    setShowSessionDrawer((v) => !v);
  }, [showSessionDrawer, loadSessionList]);

  const handleResumeSession = useCallback(async (sessionId: string) => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.sessions.resume(sessionId);
    if (result.ok && result.session) {
      setMessages([]);
      setActiveSessionId(result.session.id);
      setActiveSessionTitle(result.session.title);
      setShowSessionDrawer(false);
    }
  }, []);

  return (
    <>
      <div className="panel-header">
        <span>
          Agent Chat
          {activeSessionTitle && (
            <span className="session-badge" title={`Session: ${activeSessionId}`}>
              {activeSessionTitle.length > 40 ? activeSessionTitle.slice(0, 40) + '…' : activeSessionTitle}
            </span>
          )}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="btn-secondary"
            style={{ width: 'auto', padding: '2px 8px', marginTop: 0 }}
            onClick={handleToggleSessionDrawer}
            title="Session history"
          >
            <History size={14} />
          </button>
          <button
            className="btn-secondary"
            style={{ width: 'auto', padding: '2px 8px', marginTop: 0 }}
            onClick={handleNewSession}
            title="New session"
          >
            <Plus size={14} />
          </button>
          <button
            className="btn-secondary"
            style={{ width: 'auto', padding: '2px 8px', marginTop: 0 }}
            onClick={() => setMessages([])}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Session history drawer */}
      {showSessionDrawer && (
        <div className="session-drawer">
          <div className="session-drawer-header">
            <span>Previous Sessions</span>
            <button className="btn-icon" onClick={() => setShowSessionDrawer(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="session-drawer-list">
            {sessionList.length === 0 && (
              <div className="empty-state" style={{ padding: '16px 0' }}>
                <div className="empty-state-text">No previous sessions</div>
              </div>
            )}
            {sessionList.map((s) => (
              <button
                key={s.id}
                className={`session-drawer-item ${s.id === activeSessionId ? 'active' : ''}`}
                onClick={() => handleResumeSession(s.id)}
              >
                <div className="session-drawer-item-title">{s.title}</div>
                <div className="session-drawer-item-meta">
                  {s.messageCount} msg · {s.skillId} · {new Date(s.lastActiveAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chronological timeline */}
      <div className="chat-messages">
        {timeline.length === 0 && !interrupt && (
          <div className="empty-state">
            <MessageSquare size={32} className="empty-state-icon" />
            <div className="empty-state-text">What would you like to do?</div>
          </div>
        )}

        {timeline.map((item) => {
          if (item.kind === 'message') {
            const msg = item.data;
            const isLastAssistant =
              msg.role === 'assistant' &&
              msg.id === messages[messages.length - 1]?.id;
            return (
              <div key={msg.id} className={`chat-message ${msg.role}`}>
                <div className="chat-message-header">
                  {msg.role === 'user' ? (
                    'You'
                  ) : (
                    <><Bot size={14} className="inline-icon" /> Copilot</>
                  )}{' '}
                  — {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="chat-message-body">
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                  {isLastAssistant && isStreaming && <span className="streaming-cursor" />}
                </div>
              </div>
            );
          }
          return <InlineToolCall key={item.data.id} call={item.data} />;
        })}

        {/* HITL Approval Card */}
        {interrupt && (
          <ApprovalCard
            message={interrupt.message}
            toolName={interrupt.toolName}
            proposedArgs={interrupt.proposedArgs}
            diffPreview={interrupt.diffPreview}
            onApprove={handleApprove}
            onSkip={handleSkip}
          />
        )}

        {/* CLI Activity (non-tool events only) */}
        {filteredCliActivity.length > 0 && (
          <CliActivityStream entries={filteredCliActivity} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            className="chat-input"
            placeholder="Ask a follow-up or give instructions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="chat-send-btn" onClick={handleSend}>
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

/** Single inline tool call row — expandable to show args/result. */
function InlineToolCall({ call }: { call: ToolCallEntry }) {
  const [expanded, setExpanded] = useState(false);

  const statusIcon =
    call.status === 'pending' ? <Loader2 size={14} className="spin" /> :
    call.status === 'success' ? <CheckCircle2 size={14} /> :
    <XCircle size={14} />;

  const statusClass =
    call.status === 'pending' ? 'tool-inline-pending' :
    call.status === 'success' ? 'tool-inline-success' :
    'tool-inline-error';

  return (
    <div className={`tool-inline ${statusClass}`}>
      <div className="tool-inline-row" onClick={() => setExpanded(!expanded)}>
        <span className="tool-inline-icon">
          <Wrench size={13} />
        </span>
        <span className={`tool-inline-status ${call.status}`}>
          {statusIcon}
        </span>
        <span className="tool-inline-name">{call.name}</span>
        {call.durationMs != null && call.durationMs > 0 && (
          <span className="tool-inline-duration">
            {call.durationMs < 1000 ? `${call.durationMs}ms` : `${(call.durationMs / 1000).toFixed(1)}s`}
          </span>
        )}
        <span className="tool-inline-expand">
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </div>
      {expanded && (
        <div className="tool-inline-detail">
          {call.args && Object.keys(call.args).length > 0 && (
            <div className="tool-inline-section">
              <span className="tool-inline-section-label">Arguments</span>
              <pre className="tool-inline-pre">{JSON.stringify(call.args, null, 2)}</pre>
            </div>
          )}
          {call.result !== undefined && (
            <div className="tool-inline-section">
              <span className="tool-inline-section-label">Result</span>
              <ToolResultView toolName={call.name} result={call.result} />
            </div>
          )}
          {!call.args && call.result === undefined && (
            <div className="tool-inline-section">
              <span className="tool-inline-section-label">
                {call.status === 'pending' ? 'Running…' : 'No details available'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
