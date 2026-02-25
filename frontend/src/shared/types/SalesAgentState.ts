// Sales Agent shared state — consumed by Research Canvas via AG-UI (§9)

// ── CRM Entity Interfaces ──────────────────────────────────────────

/** Opportunity record from list_opportunities / crm_get_record */
export interface CrmOpportunity {
  opportunityid: string;
  name: string;
  estimatedclosedate: string | null;
  msp_estcompletiondate: string | null;
  msp_consumptionconsumedrecurring: number;
  _ownerid_value: string;
  _parentaccountid_value: string;
  msp_salesplay: string | null;
  statecode?: number;
}

/** Milestone record from get_milestones */
export interface CrmMilestone {
  msp_engagementmilestoneid: string;
  msp_milestonenumber: string;
  msp_name: string;
  _msp_workloadlkid_value: string | null;
  msp_commitmentrecommendation: number;
  'msp_commitmentrecommendation@OData.Community.Display.V1.FormattedValue'?: string;
  msp_milestonecategory: number;
  'msp_milestonecategory@OData.Community.Display.V1.FormattedValue'?: string;
  msp_monthlyuse: number | null;
  msp_milestonedate: string;
  msp_milestonestatus: number;
  'msp_milestonestatus@OData.Community.Display.V1.FormattedValue'?: string;
  _ownerid_value: string;
  _msp_opportunityid_value: string;
  msp_forecastcomments: string | null;
  msp_forecastcommentsjsonfield: string | null;
}

/** Task record from get_milestone_activities */
export interface CrmTask {
  activityid: string;
  subject: string;
  scheduledend: string | null;
  statuscode: number;
  'statuscode@OData.Community.Display.V1.FormattedValue'?: string;
  statecode: number;
  _ownerid_value: string;
  _regardingobjectid_value: string;
  description: string | null;
  msp_taskcategory: number | null;
  'msp_taskcategory@OData.Community.Display.V1.FormattedValue'?: string;
}

/** Account record from list_accounts_by_tpid */
export interface CrmAccount {
  accountid: string;
  name: string;
  msp_mstopparentid: string;
}

// ── View Tool Output Shapes ──────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  milestoneNumber: string;
  status: string | number;
  monthlyUse: number | null;
  opportunityId: string | null;
  opportunityName: string | null;
}

export interface TimelineData {
  count: number;
  events: TimelineEvent[];
  renderHints: {
    view: 'timeline';
    defaultSort: { field: 'date'; direction: 'asc' };
    dateField: 'date';
    titleField: 'title';
    laneField: 'opportunityName';
    statusField: 'status';
  };
}

export interface CostTrendPoint {
  month: string;
  plannedMonthlyUse: number;
}

export interface CostTrendData {
  opportunity: {
    id: string;
    name: string;
    estimatedCloseDate: string | null;
    estimatedCompletionDate: string | null;
    consumedRecurring: number;
  };
  points: CostTrendPoint[];
  kpis: {
    consumedRecurring: number;
    totalPlannedMonthlyUse: number;
    latestPlannedMonthlyUse: number;
  };
  renderHints: {
    view: 'timeseries';
    xField: 'month';
    yFields: ['plannedMonthlyUse'];
    currency: 'USD';
    defaultChart: 'line';
    showTable: true;
  };
}

export interface DiffRow {
  field: string;
  before: unknown;
  after: unknown;
  changeType: 'added' | 'updated' | 'removed';
}

export interface DiffData {
  context: string | null;
  summary: { changedFieldCount: number };
  rows: DiffRow[];
  renderHints: {
    view: 'diffTable';
    columns: ['field', 'before', 'after', 'changeType'];
    emphasisField: 'changeType';
  };
}

// ── Source Node ──────────────────────────────────────────────────────

export type SourceNodeStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface SourceNode<T = unknown> {
  status: SourceNodeStatus;
  count: number;
  records?: T[];
  signals: string[];
  lastFetched?: string;
}

// ── Correlation ─────────────────────────────────────────────────────

export interface Signal {
  source: string;
  text: string;
  confidence: number;
  target?: string;     // For correlation edges
  strength?: number;   // 0-1 correlation strength
  label?: string;      // Edge label
}

export interface Contact {
  name: string;
  role: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

// ── Agent State ─────────────────────────────────────────────────────

export interface SalesAgentState {
  runId: string;
  skill: string;
  status: 'idle' | 'running' | 'paused' | 'complete' | 'error';
  progress: number;

  sources: {
    transcripts: SourceNode;
    emails: SourceNode;
    teams: SourceNode;
    sharepoint: SourceNode;
    opportunities: SourceNode<CrmOpportunity>;
    milestones: SourceNode<CrmMilestone>;
    tasks: SourceNode<CrmTask>;
  };

  correlations: {
    signals: Signal[];
    riskLevel: 'low' | 'medium' | 'high';
    momentum: 'declining' | 'stable' | 'growing';
    champions: Contact[];
    blockers: string[];
    recommendations: string[];
  };

  timeline?: TimelineData;
  costTrend?: CostTrendData;

  output: {
    markdown: string;
    citations: Array<{ source: string; ref: string }>;
    status: 'streaming' | 'complete';
  };

  interrupt?: {
    message: string;
    toolName: string;
    proposedArgs: Record<string, unknown>;
    diffPreview?: DiffData;
  };
}

export function createInitialState(): SalesAgentState {
  const emptyNode = <T = unknown>(): SourceNode<T> => ({
    status: 'idle',
    count: 0,
    signals: [],
  });

  return {
    runId: '',
    skill: '',
    status: 'idle',
    progress: 0,
    sources: {
      transcripts: emptyNode(),
      emails: emptyNode(),
      teams: emptyNode(),
      sharepoint: emptyNode(),
      opportunities: emptyNode(),
      milestones: emptyNode(),
      tasks: emptyNode(),
    },
    correlations: {
      signals: [],
      riskLevel: 'low',
      momentum: 'stable',
      champions: [],
      blockers: [],
      recommendations: [],
    },
    output: {
      markdown: '',
      citations: [],
      status: 'streaming',
    },
  };
}
