// SourceNode — a single data-source card on the Research Canvas
import React from 'react';

export interface SourceNodeData {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  count?: number;
  items?: unknown[];
}

interface SourceNodeCardProps {
  icon: string;
  title: string;
  node?: SourceNodeData;
}

export function SourceNodeCard({ icon, title, node }: SourceNodeCardProps) {
  const status = node?.status ?? 'idle';

  return (
    <div className={`source-node ${status}`}>
      <div className="source-node-header">
        <span className="source-node-icon">{icon}</span>
        <span className="source-node-title">{title}</span>
        {status === 'loading' && <span className="source-node-spinner">⟳</span>}
        {status === 'loaded' && node?.count != null && (
          <span className="source-node-count">{node.count}</span>
        )}
      </div>
      <div className="source-node-body">
        {status === 'idle' && <span className="source-node-idle">Waiting</span>}
        {status === 'loading' && <span className="source-node-loading">Fetching…</span>}
        {status === 'loaded' && (
          <span className="source-node-loaded">{node?.count ?? 0} items loaded</span>
        )}
        {status === 'error' && <span className="source-node-error">Error</span>}
      </div>
    </div>
  );
}
