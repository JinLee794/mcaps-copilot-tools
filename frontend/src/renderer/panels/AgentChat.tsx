// Agent Chat — message thread + tool call log + HITL approval (§5.3)
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToolCallLog } from '../components/ToolCallLog';
import { ApprovalCard } from '../components/ApprovalCard';
import { CliActivityStream } from '../components/CliActivityStream';
import { useAgentState, useAgUiEvents } from '../hooks/useAgUiTransport';
import type { ElectronAPI } from '../../main/preload';

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

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useAgentState();
  const { toolCalls, interrupt, streamingText, cliActivity } = useAgUiEvents();

  // Append or update the assistant message as streaming text arrives
  useEffect(() => {
    if (!streamingText) return;
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg.id.startsWith('assistant-stream-')) {
        // Update existing streaming message
        return prev.map((m) =>
          m.id === lastMsg.id ? { ...m, content: streamingText } : m,
        );
      }
      // Start new assistant message
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolCalls]);

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

    // Send to main process via IPC
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

  return (
    <>
      <div className="panel-header">
        <span>Agent Chat</span>
        <button
          className="btn-secondary"
          style={{ width: 'auto', padding: '2px 8px', marginTop: 0 }}
          onClick={() => setMessages([])}
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-text">What would you like to do?</div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.role}`}>
            <div className="chat-message-header">
              {msg.role === 'user' ? 'You' : '🤖 Copilot'} —{' '}
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            {msg.content}
          </div>
        ))}

        {/* CLI Activity Stream */}
        {cliActivity.length > 0 && <CliActivityStream entries={cliActivity} />}

        {/* Tool Call Log */}
        {toolCalls.length > 0 && <ToolCallLog calls={toolCalls} />}

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
            ▶
          </button>
        </div>
      </div>
    </>
  );
}
