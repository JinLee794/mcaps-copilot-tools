// CorrelationGraph — visual edges between source nodes (§5.2)
//
// Renders SVG lines connecting correlated source nodes.
// Uses lightweight SVG overlay — no D3 dependency for simplicity.

import React, { useMemo } from 'react';
import { Flame, ArrowRight, Pause } from 'lucide-react';

export interface CorrelationEdge {
  from: string;      // Source node ID (e.g., "emails")
  to: string;        // Target node ID (e.g., "milestones")
  strength: number;  // 0-1 correlation strength
  label?: string;    // Edge label
}

interface CorrelationGraphProps {
  edges: CorrelationEdge[];
  riskLevel: 'low' | 'medium' | 'high';
  momentum: 'stalled' | 'steady' | 'accelerating';
}

// Fixed positions for each source node in the grid layout
// Matches the 2-column grid in ResearchCanvas
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  emails:       { x: 25, y: 15 },
  transcripts:  { x: 75, y: 15 },
  teams:        { x: 25, y: 45 },
  sharepoint:   { x: 75, y: 45 },
  milestones:   { x: 25, y: 75 },
  tasks:        { x: 75, y: 75 },
};

function edgeColor(strength: number, riskLevel: string): string {
  if (riskLevel === 'high') return `rgba(239, 68, 68, ${0.3 + strength * 0.7})`;
  if (riskLevel === 'medium') return `rgba(245, 158, 11, ${0.3 + strength * 0.7})`;
  return `rgba(34, 197, 94, ${0.3 + strength * 0.7})`;
}

export function CorrelationGraph({ edges, riskLevel, momentum }: CorrelationGraphProps) {
  const lines = useMemo(() => {
    return edges
      .filter((e) => NODE_POSITIONS[e.from] && NODE_POSITIONS[e.to])
      .map((edge, i) => {
        const from = NODE_POSITIONS[edge.from];
        const to = NODE_POSITIONS[edge.to];
        const color = edgeColor(edge.strength, riskLevel);
        const strokeWidth = 1 + edge.strength * 2;

        return (
          <g key={i}>
            <line
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={edge.strength < 0.5 ? '4 4' : 'none'}
              opacity={0.7}
            />
            {edge.label && (
              <text
                x={`${(from.x + to.x) / 2}%`}
                y={`${(from.y + to.y) / 2}%`}
                fill="var(--text-muted)"
                fontSize={9}
                textAnchor="middle"
                dy={-4}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      });
  }, [edges, riskLevel]);

  if (edges.length === 0) return null;

  return (
    <div className="correlation-graph">
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {lines}
      </svg>
      <div className="correlation-legend">
        <span className="correlation-badge" data-risk={riskLevel}>
          Risk: {riskLevel}
        </span>
        <span className="correlation-badge" data-momentum={momentum}>
          {momentum === 'accelerating' ? <Flame size={12} /> : momentum === 'steady' ? <ArrowRight size={12} /> : <Pause size={12} />} {momentum}
        </span>
      </div>
    </div>
  );
}
