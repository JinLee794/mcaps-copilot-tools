// Agent Chat — unified message timeline with inline tool calls + HITL approval (§5.3)
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, Bot, SendHorizonal, Wrench, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronRight, Plus, History, X, PanelRightOpen } from 'lucide-react';
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

interface ObsidianNotePreview {
  id: string;
  title: string;
  markdown: string;
}

type TimelineItem =
  | { kind: 'message'; data: ChatMessage }
  | { kind: 'tool-call'; data: ToolCallEntry };

const OBSIDIAN_TOOLS = new Set(['read_note', 'read_multiple_notes']);

function parseMcpResult(result: unknown): unknown {
  if (!result) return null;
  if (typeof result === 'object' && !Array.isArray(result)) {
    const obj = result as Record<string, unknown>;
    if (Array.isArray(obj['content'])) {
      const first = (obj['content'] as Array<Record<string, unknown>>)[0];
      if (first?.type === 'text' && typeof first.text === 'string') {
        try { return JSON.parse(first.text as string); } catch { return first.text; }
      }
    }
    return obj;
  }
  if (typeof result === 'string') {
    try { return JSON.parse(result); } catch { return result; }
  }
  return result;
}

function inferNoteTitle(path: unknown, fallback: string): string {
  if (typeof path !== 'string' || path.length === 0) return fallback;
  const base = path.split('/').pop() ?? fallback;
  return base.replace(/\.md$/i, '');
}

function extractObsidianNotes(call: ToolCallEntry): ObsidianNotePreview[] {
  if (!OBSIDIAN_TOOLS.has(call.name) || call.status !== 'success' || call.result == null) return [];
  const parsed = parseMcpResult(call.result);
  const argsPath = call.args?.path;
  if (typeof parsed === 'string') {
    return [{ id: `${call.id}-single`, title: inferNoteTitle(argsPath, 'Obsidian note'), markdown: parsed }];
  }
  if (typeof parsed !== 'object' || parsed == null) return [];
  const obj = parsed as Record<string, unknown>;
  if (typeof obj['content'] === 'string') {
    return [{ id: `${call.id}-single`, title: inferNoteTitle(obj['path'] ?? argsPath, 'Obsidian note'), markdown: String(obj['content']) }];
  }
  if (Array.isArray(obj['notes'])) {
    return (obj['notes'] as Array<Record<string, unknown>>)
      .filter((n) => typeof n['content'] === 'string')
      .map((n, i) => ({
        id: `${call.id}-${i}`,
        title: inferNoteTitle(n['path'], `Note ${i + 1}`),
        markdown: String(n['content']),
      }));
  }
  return [];
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showSessionDrawer, setShowSessionDrawer] = useState(false);
  const [sessionList, setSessionList] = useState<SessionMeta[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
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
  const notePreviews = useMemo(() => {
    const notes = toolCalls.flatMap(extractObsidianNotes);
    const dedup = new Map<string, ObsidianNotePreview>();
    for (const note of notes) {
      const key = `${note.title}:${note.markdown.slice(0, 80)}`;
      if (!dedup.has(key)) dedup.set(key, note);
    }
    return [...dedup.values()];
  }, [toolCalls]);
  const selectedNote = notePreviews.find((n) => n.id === selectedNoteId) ?? null;

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
      setSelectedNoteId(null);
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
      <div className="chat-top-actions">
        {activeSessionTitle && (
          <span className="session-badge" title={`Session: ${activeSessionId}`}>
            {activeSessionTitle.length > 40 ? activeSessionTitle.slice(0, 40) + '…' : activeSessionTitle}
          </span>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-secondary" style={{ width: 'auto', padding: '4px 9px', marginTop: 0 }} onClick={handleToggleSessionDrawer} title="Session history"><History size={14} /></button>
          <button className="btn-secondary" style={{ width: 'auto', padding: '4px 9px', marginTop: 0 }} onClick={handleNewSession} title="New session"><Plus size={14} /></button>
          <button className="btn-secondary" style={{ width: 'auto', padding: '4px 9px', marginTop: 0 }} onClick={() => setMessages([])}>Clear</button>
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

      <div className={`chat-layout ${selectedNote ? 'note-open' : ''}`}>
        <div className="chat-main">
          {/* Chronological timeline */}
          <div className="chat-messages chat-messages-centered">
            {timeline.length === 0 && !interrupt && (
              <div className="empty-state prompt-first-empty">
                <MessageSquare size={32} className="empty-state-icon" />
                <div className="empty-state-text">Ask Copilot CLI anything</div>
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
          <div className="chat-input-area centered-input-area">
            <div className="chat-input-wrapper centered-chat-input-wrapper">
              <input
                className="chat-input centered-chat-input"
                placeholder="Ask Copilot CLI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="chat-send-btn" onClick={handleSend}>
                <SendHorizonal size={16} />
              </button>
            </div>
          </div>

          {notePreviews.length > 0 && (
            <div className="obsidian-note-strip">
              <div className="obsidian-note-strip-title"><PanelRightOpen size={13} /> Obsidian Notes</div>
              <div className="obsidian-note-titles">
                {notePreviews.map((note) => (
                  <button
                    key={note.id}
                    className={`obsidian-note-pill ${selectedNoteId === note.id ? 'active' : ''}`}
                    onClick={() => setSelectedNoteId(selectedNoteId === note.id ? null : note.id)}
                  >
                    {note.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedNote && (
          <aside className="obsidian-note-panel">
            <div className="obsidian-note-panel-header">
              <span>{selectedNote.title}</span>
              <button className="btn-icon" onClick={() => setSelectedNoteId(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="obsidian-note-panel-body">
              <ReactMarkdown>{selectedNote.markdown}</ReactMarkdown>
            </div>
          </aside>
        )}
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
