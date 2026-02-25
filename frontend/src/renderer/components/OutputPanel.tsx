// OutputPanel — streamed markdown output with citations (§5.2)
import React, { useCallback, useState } from 'react';
import { FileText, Copy, CheckCheck, Radio, BookOpen, ExternalLink } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  if (status === 'idle' && !markdown) {
    return (
      <div className="output-panel output-panel-empty">
        <div className="empty-state">
          <FileText size={32} className="empty-state-icon" />
          <div className="empty-state-text">
            Output will appear here once a skill runs.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`output-panel ${status}`}>
      <div className="output-panel-header">
        <div className="output-panel-title">
          <FileText size={14} />
          <span>Output</span>
        </div>
        <div className="output-panel-actions">
          {status === 'streaming' && (
            <span className="output-streaming-badge">
              <Radio size={12} className="output-pulse" />
              Streaming
            </span>
          )}
          {(status === 'complete' || markdown) && (
            <button
              className="output-copy-btn"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? <><CheckCheck size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          )}
        </div>
      </div>
      <div className="output-panel-body markdown-body">
        <Markdown>{markdown}</Markdown>
        {status === 'streaming' && <span className="output-cursor" />}
      </div>

      {citations.length > 0 && (
        <div className="output-citations">
          <div className="output-citations-header">
            <BookOpen size={12} />
            Sources ({citations.length})
          </div>
          <div className="output-citations-list">
            {citations.map((c) => (
              <div key={c.id} className="output-citation">
                <span className="citation-id">{c.id}</span>
                <div className="citation-content">
                  <span className="citation-source">
                    <ExternalLink size={10} />
                    {c.source}
                  </span>
                  {c.excerpt && <span className="citation-excerpt">{c.excerpt}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
