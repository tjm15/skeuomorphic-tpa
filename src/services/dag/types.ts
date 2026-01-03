
// PlanState DAG - Core Types
// Based on CULP v0 Spec

export type ID = string;
export type Timestamp = string; // ISO string

// --- Enums ---

export enum NodeType {
    // Root/Meta
    PLAN = 'PLAN',
    ART = 'ART',
    PUB = 'PUB',
    RUN = 'RUN',
    PATCH = 'PATCH',

    // Programme
    MILE = 'MILE',
    GATE = 'GATE',
    DEC = 'DEC',
    RISK = 'RISK',

    // Policies
    VISION = 'VISION',
    OBJ = 'OBJ',
    METRIC = 'METRIC',
    POL = 'POL',
    CL = 'CL',
    MOD = 'MOD',

    // Places
    PLC = 'PLC',
    SITE = 'SITE',
    SAS_METH = 'SAS_METH',
    SAS_RES = 'SAS_RES',
    ALOC = 'ALOC',
    DES = 'DES',
    MAP_LAYER = 'MAP_LAYER',
    CONSTR = 'CONSTR',
    INFRA = 'INFRA',

    // Evidence
    EVI = 'EVI',
    DATA = 'DATA',
    BASE = 'BASE',
    CLM = 'CLM',
    CLMSET = 'CLMSET',
    GAP = 'GAP',
    COMP = 'COMP',

    // Engage
    CONS = 'CONS',
    REP = 'REP',
    ISS = 'ISS',
    RESP = 'RESP',
    SOCG = 'SOCG',

    // Scenarios
    SCEN = 'SCEN',
    ASSUMP = 'ASSUMP',
    EVAL = 'EVAL',
    CMP = 'CMP',
    ALT = 'ALT',
    SEA = 'SEA',

    // Monitoring
    IND = 'IND',
    SER = 'SER',
    DELIV = 'DELIV',
    DRIFT = 'DRIFT',
    ALERT = 'ALERT',
    AMR = 'AMR',
    REVIEW = 'REVIEW'
}

export enum EdgeType {
    // A) Versioning & Change
    SUPERSEDES = 'supersedes',
    AMENDS = 'amends',
    APPLIES_TO_STATE = 'applies_to_state',
    GENERATED_BY = 'generated_by',

    // B) Programme & Commitments
    DEPENDS_ON = 'depends_on',
    REQUIRES = 'requires',
    DECIDES = 'decides',
    RECORDS = 'records',

    // C) Norms <-> Space
    SPATIALISED_AS = 'spatialised_as',
    APPLIES_TO = 'applies_to',
    LOCATED_IN = 'located_in',
    ALLOCATES = 'allocates',
    IMPLEMENTS_OUTCOME = 'implements_outcome',

    // D) Evidence & Warrant
    SUPPORTS = 'supports',
    UNDERMINES = 'undermines',
    DERIVED_FROM = 'derived_from',
    CLAIMS_ABOUT = 'claims_about',
    GAPS_FOR = 'gaps_for',

    // E) Engagement & Contestation
    SUBMITTED_TO = 'submitted_to',
    RAISES = 'raises',
    CONTESTS = 'contests',
    RESPONDS_TO = 'responds_to',
    RESULTS_IN = 'results_in',
    AGREES = 'agrees',

    // F) Scenarios, Alternatives, SEA
    ALTERNATIVE_TO = 'alternative_to',
    COMPOSED_OF = 'composed_of',
    EVALUATED_BY = 'evaluated_by',
    APPRAISED_IN = 'appraised_in',
    MITIGATED_BY = 'mitigated_by',
    RECOMMENDS_MONITORING = 'recommends_monitoring',
    PROPOSES_ADOPTION = 'proposes_adoption',

    // G) Monitoring & Drift
    MEASURES = 'measures',
    INSTANTIATES = 'instantiates',
    SIGNALS_DRIFT_ON = 'signals_drift_on',
    COMPARES_TO = 'compares_to',
    TRIGGERS_REVIEW = 'triggers_review',

    // H) Publication
    PUBLISHED_AS = 'published_as',
    SUBMITTED_AS = 'submitted_as',
    REFERENCES = 'references'
}

// --- Generics ---

export interface Node<T = any> {
    id: ID;
    type: NodeType;
    title?: string; // Human readable label
    status?: string; // Type-specific status string
    owner_id?: ID; // Tree parent (null for ROOT)
    data: T; // Payload
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface Edge {
    id: ID;
    type: EdgeType;
    from_id: ID;
    to_id: ID;
    meta?: Record<string, any>;
    created_at: Timestamp;
}

// --- Payloads (Examples) ---

export interface PlanNodeData {
    title?: string;
    version?: string;
    status?: string;
    localAuthority?: string;
    horizonStart?: number;
    horizonEnd?: number;
}

export interface PolicyNodeData {
    code: string;
    title: string;
    text: string; // Markdown
    intent?: string;
    status?: string;
}

export interface EvidenceNodeData {
    title: string;
    documentUrl?: string; // instead of url
    source?: string;
    summary?: string;
    status?: string;
}

export interface SiteNodeData {
    code: string; // Ref code (SA-01)
    address: string;
    areaHa: number; // Renamed from sizeHa
    capacity: number;
    coordinates?: [number, number];
    status?: string;
}

export interface IssueNodeData {
    title: string;
    description: string;
    severity: string;
    status: string;
}

// Default empty payload
export interface EmptyData { }
