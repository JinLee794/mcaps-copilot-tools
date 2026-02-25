// OutputPanel — streamed markdown output with citations (§5.2)
import React, { useCallback } from 'react';
import Markdown from 'react-markdown';

interface Citation {
  id: string;
  source: string;
  excerpt: string;
}

interface OutputPanelProps {
  markdown: string;
  citations: Citation[];
  status: 'idle' | 'streaming' | 'complete';
}

export function OutputPanel({ markdown, citations, status }: OutputPanelProps) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
  }, [markdown]);

  if (status === 'idle' && !markdown) {
    return (
      <div className="output-panel-empty">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">
            Output will appear here once a skill runs.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="output-panel">
      <div className="output-panel-header">
        <span>Output</span>
        {status === 'streaming' && <span className="output-streaming">● Streaming</span>}
        {status === 'complete' && (
          <button
            className="btn-secondary"
            style={{ width: 'auto', padding: '2px 8px', marginTop: 0 }}
            onClick={handleCopy}
          >
            📋 Copy
          </button>
        )}
      </div>
      <div className="output-panel-body markdown-body">
        <Markdown>{markdown}</Markdown>
        {status === 'streaming' && <span className="output-cursor">▊</span>}
      </div>

      {citations.length > 0 && (
        <div className="output-citations">
          <div className="output-citations-header">Sources ({citations.length})</div>
          {citations.map((c) => (
            <div key={c.id} className="output-citation">
              <span className="citation-id">[{c.id}]</span>
              <span className="citation-source">{c.source}</span>
              {c.excerpt && <span className="citation-excerpt">— {c.excerpt}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
