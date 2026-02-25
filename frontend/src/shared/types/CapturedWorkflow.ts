// Captured Workflow types — deterministic replay engine (§13.5)

export interface WorkflowParameter {
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  default?: string | number | boolean;
  description: string;
}

export interface WorkflowStepMcpTool {
  id: string;
  type: 'mcp_tool';
  server: string;
  tool: string;
  args: Record<string, unknown>;
  expectedOutputShape?: Record<string, unknown> | string;
  onError: 'skip' | 'abort' | 'retry';
  timeout: number;
}

export interface WorkflowStepLlmSynthesize {
  id: string;
  type: 'llm_synthesize';
  inputs: string[];
  template: string;
  outputFormat: 'markdown' | 'json';
}

export type WorkflowStep = WorkflowStepMcpTool | WorkflowStepLlmSynthesize;

export interface ApprovalGate {
  beforeStep: string;
  message: string;
  requiredRole: string[];
}

export interface CapturedWorkflow {
  id: string;
  name: string;
  skillId: string;
  version: number;
  capturedAt: string;
  capturedBy: string;
  estimatedDurationMs: number;
  parameters: Record<string, WorkflowParameter>;
  steps: WorkflowStep[];
  approvalGates: ApprovalGate[];
}

export interface WorkflowRegistryEntry {
  id: string;
  name: string;
  skillId: string;
  version: number;
  capturedAt: string;
  stepsCount: number;
  estimatedDurationMs: number;
  starred: boolean;
}
