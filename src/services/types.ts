// Core object types for TPA

export type ID = string;
export type Timestamp = string; // ISO string

// --- Plan & Core ---

export type PlanPhase = 'gateway-1' | 'gateway-2' | 'gateway-3' | 'adopted';

export interface Plan {
  id: ID;
  title: string;
  localAuthority: string;
  phase: PlanPhase;
  horizonStart: number;
  horizonEnd: number;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PlanSnapshot {
  id: ID;
  planId: ID;
  label: string;
  checksum: string;
  createdAt: Timestamp;
}

// --- Policy ---

export type PolicyStatus = 'draft' | 'proposed' | 'adopted' | 'deprecated';

export interface Policy {
  id: ID;
  planId: ID;
  code: string; // e.g. "H1"
  title: string;
  text: string; // Markdown
  intent: string;
  status: PolicyStatus;
  tags: string[];
  version: number;
  linkedEvidenceIds: ID[];
}

// --- Site ---

export type SiteStatus = 'candidate' | 'assessed' | 'shortlisted' | 'allocated' | 'rejected';

export interface Site {
  id: ID;
  planId: ID;
  ref: string; // e.g. "SITE-001"
  name: string;
  address: string;
  sizeHa: number;
  capacity: number; // dwellings
  status: SiteStatus;
  coordinates: [number, number]; // Lat, Lng
  constraints: string[];
  proposedUse: string;
}

// --- Evidence ---

export type EvidenceType = 'document' | 'dataset' | 'map' | 'representation';

export interface EvidenceItem {
  id: ID;
  planId: ID;
  title: string;
  type: EvidenceType;
  url?: string;
  summary?: string; // AI generated
  uploadDate: Timestamp;
  source: string;
}

// --- Scenarios ---

export interface Scenario {
  id: ID;
  planId: ID;
  name: string;
  description: string;
  baseParams: Record<string, any>; // e.g. { housingTarget: 15000, greenbelt: 'protect' }
  createdAt: Timestamp;
  isCurrent: boolean; // if this scenario is the active plan basis
}

// --- Issues & Diagnostics ---

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IssueType = 'contradiction' | 'gap' | 'risk' | 'representation';

export interface Issue {
  id: ID;
  planId: ID;
  title: string;
  description: string;
  severity: IssueSeverity;
  type: IssueType;
  relatedObjectIds: ID[]; // Policies, Sites, etc.
  resolved: boolean;
}

// --- Monitoring ---

export type SignalLevel = 'on-track' | 'risk' | 'critical';

export interface MonitoringSignal {
  id: ID;
  planId: ID;
  metric: string;
  targetValue: number;
  currentValue: number;
  trend: 'up' | 'down' | 'flat';
  level: SignalLevel;
  lastUpdated: Timestamp;
}

// --- AI / Patches ---

export type PatchType = 'create' | 'update' | 'delete';

export interface PatchOp {
  op: PatchType;
  path: string; // e.g. "policies/POL-001/text"
  value?: any;
}

export interface PatchBundle {
  id: ID;
  planId: ID;
  title: string;
  description: string; // Rationale
  status: 'pending' | 'accepted' | 'rejected';
  patches: PatchOp[];
  trace?: JudgementTrace;
  createdAt: Timestamp;
}

export interface JudgementTrace {
  reasoning: string;
  citations: ID[]; // Evidence IDs
  model: string;
}

// --- Gateway ---

export type GatewayStatus = 'not-started' | 'in-progress' | 'pass' | 'fail';

export interface GatewayCut {
  id: ID;
  planId: ID;
  gatewayName: string;
  status: GatewayStatus;
  checkPerformedAt: Timestamp;
  issuesFound: ID[]; // Issue IDs
  missingItems: string[];
  score: number; // 0-100 coherence score
}
