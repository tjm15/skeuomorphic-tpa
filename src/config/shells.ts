
/* ============================================================================
   Shell Config Schema (v0.1)
   - Goal: a generic “PlanState workspace” renderer driven by config.
   - Assumption: PlanState is a tree of nodes + a graph of edges (by IDs).
   - Shells are view-configurations over the same PlanState graph.
============================================================================ */

export type ShellId =
    | "home"
    | "programme"
    | "policies"
    | "places"
    | "evidence"
    | "engage"
    | "scenarios"
    | "monitoring";

export type NodeType =
    | "PLAN"
    | "MILE"
    | "GATE"
    | "DEC"
    | "POL"
    | "CL"
    | "PLC"
    | "SITE"
    | "DES"
    | "ALOC"
    | "EVI"
    | "CLM"
    | "GAP"
    | "REP"
    | "ISS"
    | "RESP"
    | "SOCG"
    | "SCEN"
    | "ALT"
    | "EVAL"
    | "SEA"
    | "IND"
    | "SER"
    | "DRIFT"
    | "AMR"
    | "REVIEW"
    | "PUB"
    | "PATCH"
    | "ART"
    | "RUN";

export type EdgeType =
    | "supersedes"
    | "amends"
    | "applies_to_state"
    | "generated_by"
    | "depends_on"
    | "requires"
    | "decides"
    | "records"
    | "spatialised_as"
    | "applies_to"
    | "located_in"
    | "allocates"
    | "implements_outcome"
    | "supports"
    | "undermines"
    | "derived_from"
    | "claims_about"
    | "gaps_for"
    | "submitted_to"
    | "raises"
    | "contests"
    | "responds_to"
    | "results_in"
    | "agrees"
    | "alternative_to"
    | "composed_of"
    | "evaluated_by"
    | "appraised_in"
    | "mitigated_by"
    | "recommends_monitoring"
    | "proposes_adoption"
    | "measures"
    | "instantiates"
    | "signals_drift_on"
    | "compares_to"
    | "triggers_review"
    | "published_as"
    | "submitted_as"
    | "references";

export type PatchOp =
    | "create_node"
    | "update_node"
    | "link_edge"
    | "unlink_edge"
    | "supersede"
    | "publish"
    | "record_decision"
    | "apply_patch"
    | "revert_patch";

export type WorkSurfaceKind =
    | "DeskSurface" // Replaces AttentionDeck
    | "AttentionDeck" // Deprecated
    | "Timeline"
    | "ObjectSheet"
    | "MapCanvas"
    | "LibraryClaims"
    | "IssueThread"
    | "Workbench"
    | "IndicatorBoard"
    | "ComparisonSpread";

export type Primitive =
    | "PlanBar"
    | "WorkSurface"
    | "ObjectTile"
    | "ObjectSheet"
    | "EdgeChip"
    | "EdgeAnchor"
    | "EvidenceFootnote"
    | "DecisionSeal"
    | "PatchEnvelope"
    | "RedlineLayer"
    | "PublicationBanner"
    | "OverlayLens"
    | "ComparisonSpread"
    | "TraceStrip"
    | "LinkPanel"
    | "Drawer";

export type PanelKind =
    | "LinkList"          // list of linked nodes (by edge walk)
    | "WarrantStack"      // supports/undermines + attach actions
    | "ContestationStack" // issues/reps/threads + response jump
    | "Applicability"     // applies_to / spatialised_as view (map jump)
    | "Blockers"          // requires + status, critical path
    | "PackContents"      // gateway pack bundling
    | "ResponseBuilder"   // draft response + emit patch
    | "DeltaStrip"        // scenario diffs
    | "Sensitivity"       // drivers of evaluation outcomes
    | "SEAWorkbench"      // SEA/SA artefacts + mitigations + monitoring measures
    | "DriftQueue"        // alerts/drift signals
    | "RealityVsBaseline" // compares_to view
    | "ReviewTriggers"    // triggers_review / review events
    | "RecentChanges";    // patch / supersedes feed

export type LensKind =
    | "ContestationHeat"
    | "ApplicabilityOverlay"
    | "EvidenceCoverage"
    | "ScenarioDelta"
    | "DeliveryDrift";

export interface GraphWalkStep {
    edge: EdgeType;
    dir: "in" | "out";
    maxHops?: 1 | 2;
    // optional constraints (can be omitted for generic neighbourhood queries)
    fromTypes?: NodeType[];
    toTypes?: NodeType[];
}

export interface PanelAction {
    id: string;
    label: string;
    // what this action emits (usually patch items)
    ops: PatchOp[];
    // optional edge semantics for generic link actions
    edge?: EdgeType;
    // optional “create node” semantics
    creates?: NodeType;
}

export interface PanelConfig {
    id: string;
    title: string;
    kind: PanelKind;
    // panel reactivity: which focus nodes make this panel visible / meaningful
    whenFocus?: NodeType[];
    // how to populate the panel from the graph (generic traversal DSL)
    walk?: GraphWalkStep[];
    // what the user can do from this panel (must be lawful)
    actions?: PanelAction[];
    // hint to renderer: compact vs full
    density?: "compact" | "standard";
}

export interface LensConfig {
    id: string;
    label: string;
    kind: LensKind;
    // what the lens is “about” (usually an edge type)
    edge?: EdgeType;
    // optional: lens-specific traversal to generate overlay features
    walk?: GraphWalkStep[];
    // max simultaneous lenses enforced globally; keep here for clarity
    maxSimultaneous?: number;
}

export interface DrawerConfig {
    // which tabs exist for any opened object
    tabs: Array<{
        id: string;
        title: string;
        // high-level: each tab is itself a composition of primitives/panels
        includes?: PanelKind[];
    }>;
    // default tab selection by node type
    defaultTabByType: Partial<Record<NodeType, string>>;
}

export interface ShellConfig {
    id: ShellId;
    label: string;
    route: string; // "/plan/:planId/<shell>"
    intent: string; // one sentence: what this shell is for
    roots: NodeType[]; // primary node types for listing/search in this shell
    // allowed focus types for work surface selection
    focus: {
        nodeTypes: NodeType[];
        // optional subfocus semantics (clause selection, map feature selection, etc.)
        subfocus?: Array<{
            id: string;
            label: string;
            // purely informational to agent/renderer; you can implement however you like
            kind: "ClauseRange" | "MapFeature" | "IssueTarget" | "ScenarioPair" | "Indicator";
        }>;
    };
    workSurface: {
        kind: WorkSurfaceKind;
        primitives: Primitive[]; // which UI primitives are expected on this surface
    };
    // panels shown alongside the work surface (often “right rail”)
    panels: PanelConfig[];
    // overlay lenses available in this shell
    lenses?: LensConfig[];
    // which mutations are exposed as first-class affordances here
    allowedOps: PatchOp[];
    // optional: compare modes supported in this shell (enables ComparisonSpread)
    compare?: {
        modes: Array<"version" | "scenario" | "object">;
        allowedTypes: NodeType[];
    };
    // lightweight empty-state guidance (keeps prototypes from looking dead)
    emptyStates: Array<{
        when: "no_roots" | "no_focus" | "no_links" | "no_runs";
        message: string;
        primaryAction?: PanelAction;
    }>;
}

/* ============================================================================
   Canonical Drawer config (shared across shells)
============================================================================ */

export const DRAWER_V0: DrawerConfig = {
    tabs: [
        { id: "overview", title: "Overview" },
        { id: "links", title: "Links", includes: ["LinkList", "WarrantStack", "ContestationStack", "Applicability"] },
        { id: "history", title: "History", includes: ["RecentChanges"] },
        { id: "redline", title: "Redline", includes: [] },
        { id: "publication", title: "Publication", includes: [] },
        { id: "trace", title: "Trace", includes: [] },
        { id: "patch", title: "Patches", includes: [] }
    ],
    defaultTabByType: {
        POL: "overview",
        CL: "overview",
        PLC: "overview",
        SITE: "overview",
        DES: "overview",
        ALOC: "overview",
        EVI: "overview",
        CLM: "overview",
        ISS: "overview",
        REP: "overview",
        RESP: "overview",
        SCEN: "overview",
        ALT: "overview",
        IND: "overview",
        DRIFT: "overview",
        PUB: "publication",
        PATCH: "patch",
        RUN: "trace"
    }
};

/* ============================================================================
   Shell Configs (v0.1) — copyable, agent-implementable
============================================================================ */

export const SHELLS_V0: Record<ShellId, ShellConfig> = {
    home: {
        id: "home",
        label: "Home",
        route: "/plan/:planId/home",
        intent: "Orient to the current plan state: what’s live, what’s due, and what’s under pressure.",
        roots: ["PLAN"],
        focus: { nodeTypes: ["PLAN"] },
        workSurface: {
            kind: "DeskSurface", // Updated from AttentionDeck
            primitives: ["PlanBar", "WorkSurface", "ObjectTile", "Drawer", "LinkPanel"]
        },
        panels: [
            {
                id: "next_commitments",
                title: "Next commitments",
                kind: "LinkList",
                whenFocus: ["PLAN"],
                walk: [{ edge: "requires", dir: "in", maxHops: 1 }],
                density: "compact"
            },
            {
                id: "hot_contests",
                title: "Hot contests",
                kind: "ContestationStack",
                whenFocus: ["PLAN"],
                walk: [{ edge: "contests", dir: "in", maxHops: 2 }],
                density: "compact"
            },
            {
                id: "open_gaps",
                title: "Open gaps",
                kind: "LinkList",
                whenFocus: ["PLAN"],
                walk: [{ edge: "gaps_for", dir: "in", maxHops: 2 }],
                density: "compact",
                actions: [{ id: "declare_gap", label: "Declare gap", ops: ["create_node", "link_edge"], creates: "GAP", edge: "gaps_for" }]
            },
            {
                id: "recent_changes",
                title: "Recent changes",
                kind: "RecentChanges",
                whenFocus: ["PLAN"],
                walk: [{ edge: "amends", dir: "in", maxHops: 2 }],
                density: "compact"
            }
        ],
        allowedOps: ["create_node", "link_edge", "apply_patch", "revert_patch"],
        emptyStates: [
            { when: "no_roots", message: "No plan loaded. Select or create a plan state to begin." },
            { when: "no_focus", message: "Select a plan to see commitments, contests, gaps, and recent change." }
        ]
    },

    programme: {
        id: "programme",
        label: "Programme",
        route: "/plan/:planId/programme",
        intent: "Bind the plan to time: timetable, gateways, packs, decisions, and blockers.",
        roots: ["MILE", "GATE", "DEC"],
        focus: { nodeTypes: ["MILE", "GATE", "DEC"] },
        workSurface: {
            kind: "Timeline",
            primitives: ["PlanBar", "WorkSurface", "ObjectTile", "DecisionSeal", "Drawer", "LinkPanel", "PatchEnvelope"]
        },
        panels: [
            {
                id: "blockers",
                title: "Blockers",
                kind: "Blockers",
                whenFocus: ["MILE", "GATE"],
                walk: [{ edge: "requires", dir: "out", maxHops: 1 }],
                actions: [
                    { id: "start_patch", label: "Open patch", ops: ["create_node"], creates: "PATCH" }
                ]
            },
            {
                id: "pack_contents",
                title: "Pack contents",
                kind: "PackContents",
                whenFocus: ["GATE"],
                walk: [{ edge: "records", dir: "out", maxHops: 1 }],
                actions: [{ id: "prepare_publication", label: "Prepare publication", ops: ["publish"] }]
            },
            {
                id: "decisions",
                title: "Decisions",
                kind: "LinkList",
                whenFocus: ["MILE", "GATE"],
                walk: [{ edge: "decides", dir: "in", maxHops: 1 }],
                density: "compact",
                actions: [{ id: "record_decision", label: "Record decision", ops: ["record_decision"], creates: "DEC" }]
            }
        ],
        allowedOps: ["create_node", "update_node", "link_edge", "unlink_edge", "record_decision", "publish", "apply_patch", "revert_patch"],
        emptyStates: [
            {
                when: "no_roots", message: "No milestones yet. Create a timetable to bind the plan to the 30-month process.",
                primaryAction: { id: "create_milestone", label: "Create milestone", ops: ["create_node"], creates: "MILE" }
            }
        ]
    },

    policies: {
        id: "policies",
        label: "Policies",
        route: "/plan/:planId/policies",
        intent: "Draft and amend policy text as addressable clauses with warrants, contestation, and applicability links.",
        roots: ["POL", "CL"],
        focus: {
            nodeTypes: ["POL", "CL"],
            subfocus: [{ id: "clause_range", label: "Clause selection", kind: "ClauseRange" }]
        },
        workSurface: {
            kind: "ObjectSheet",
            primitives: ["PlanBar", "WorkSurface", "ObjectSheet", "EdgeAnchor", "EvidenceFootnote", "PatchEnvelope", "RedlineLayer", "Drawer", "LinkPanel"]
        },
        panels: [
            {
                id: "warrants",
                title: "Warrants",
                kind: "WarrantStack",
                whenFocus: ["POL", "CL"],
                walk: [
                    { edge: "supports", dir: "in", maxHops: 1 },
                    { edge: "undermines", dir: "in", maxHops: 1 }
                ],
                actions: [
                    { id: "attach_support", label: "Attach support", ops: ["link_edge"], edge: "supports" },
                    { id: "attach_undermining", label: "Attach undermining", ops: ["link_edge"], edge: "undermines" },
                    { id: "declare_gap", label: "Declare gap", ops: ["create_node", "link_edge"], creates: "GAP", edge: "gaps_for" }
                ]
            },
            {
                id: "contestation",
                title: "Contestation",
                kind: "ContestationStack",
                whenFocus: ["POL", "CL"],
                walk: [{ edge: "contests", dir: "in", maxHops: 2 }],
                actions: [{ id: "jump_to_issue", label: "Open issue thread", ops: [] }]
            },
            {
                id: "applicability",
                title: "Applicability",
                kind: "Applicability",
                whenFocus: ["POL", "CL"],
                walk: [
                    { edge: "applies_to", dir: "out", maxHops: 1 },
                    { edge: "spatialised_as", dir: "out", maxHops: 1 }
                ],
                actions: [{ id: "open_in_places", label: "Open on map", ops: [] }]
            },
            {
                id: "history",
                title: "History",
                kind: "RecentChanges",
                whenFocus: ["POL", "CL"],
                walk: [{ edge: "supersedes", dir: "out", maxHops: 2 }],
                density: "compact"
            }
        ],
        allowedOps: ["update_node", "link_edge", "unlink_edge", "supersede", "create_node", "apply_patch", "revert_patch", "publish"],
        emptyStates: [
            {
                when: "no_roots", message: "No policies yet. Create a policy object, then draft clauses as addressable nodes.",
                primaryAction: { id: "create_policy", label: "Create policy", ops: ["create_node"], creates: "POL" }
            },
            { when: "no_focus", message: "Select a policy or clause to see warrants, contestation, and applicability." }
        ]
    },

    places: {
        id: "places",
        label: "Places",
        route: "/plan/:planId/places",
        intent: "Work spatially: places, sites, designations, allocations, and the policies map as the plan’s geographic expression.",
        roots: ["PLC", "SITE", "DES", "ALOC"],
        focus: {
            nodeTypes: ["PLC", "SITE", "DES", "ALOC"],
            subfocus: [{ id: "map_feature", label: "Map feature", kind: "MapFeature" }]
        },
        workSurface: {
            kind: "MapCanvas",
            primitives: ["PlanBar", "WorkSurface", "OverlayLens", "ObjectTile", "PatchEnvelope", "Drawer", "LinkPanel"]
        },
        lenses: [
            {
                id: "lens_contest",
                label: "Contestation",
                kind: "ContestationHeat",
                edge: "contests",
                maxSimultaneous: 2
            },
            {
                id: "lens_applicability",
                label: "Applicability",
                kind: "ApplicabilityOverlay",
                edge: "applies_to",
                maxSimultaneous: 2
            },
            {
                id: "lens_evidence",
                label: "Evidence coverage",
                kind: "EvidenceCoverage",
                edge: "supports",
                maxSimultaneous: 2
            },
            {
                id: "lens_scenario_delta",
                label: "Scenario delta",
                kind: "ScenarioDelta",
                edge: "compares_to",
                maxSimultaneous: 2
            }
        ],
        panels: [
            {
                id: "obligations",
                title: "Obligations",
                kind: "Applicability",
                whenFocus: ["PLC", "SITE", "DES", "ALOC"],
                walk: [{ edge: "applies_to", dir: "in", maxHops: 1 }],
                actions: [{ id: "edit_boundary", label: "Edit boundary (patch)", ops: ["supersede"] }]
            },
            {
                id: "warrants",
                title: "Warrants",
                kind: "WarrantStack",
                whenFocus: ["PLC", "SITE", "DES", "ALOC"],
                walk: [
                    { edge: "supports", dir: "in", maxHops: 1 },
                    { edge: "undermines", dir: "in", maxHops: 1 }
                ],
                actions: [{ id: "attach_support", label: "Attach support", ops: ["link_edge"], edge: "supports" }]
            },
            {
                id: "contestation",
                title: "Contestation",
                kind: "ContestationStack",
                whenFocus: ["PLC", "SITE", "DES", "ALOC"],
                walk: [{ edge: "contests", dir: "in", maxHops: 2 }],
                actions: [{ id: "open_issue", label: "Open issue thread", ops: [] }]
            }
        ],
        allowedOps: ["create_node", "update_node", "link_edge", "unlink_edge", "supersede", "apply_patch", "revert_patch", "publish"],
        emptyStates: [
            {
                when: "no_roots", message: "No spatial objects yet. Create a Place, then add sites/designations/allocations.",
                primaryAction: { id: "create_place", label: "Create place", ops: ["create_node"], creates: "PLC" }
            },
            { when: "no_focus", message: "Select a feature to see obligations, warrants, and contestation." }
        ]
    },

    evidence: {
        id: "evidence",
        label: "Evidence",
        route: "/plan/:planId/evidence",
        intent: "Curate evidence items and claims, track gaps, and wire warrants into policies, places, scenarios, and decisions.",
        roots: ["EVI", "CLM", "GAP"],
        focus: { nodeTypes: ["EVI", "CLM", "GAP"] },
        workSurface: {
            kind: "LibraryClaims",
            primitives: ["PlanBar", "WorkSurface", "ObjectTile", "TraceStrip", "PatchEnvelope", "Drawer", "LinkPanel"]
        },
        panels: [
            {
                id: "dependents",
                title: "What depends on this",
                kind: "LinkList",
                whenFocus: ["EVI", "CLM"],
                walk: [{ edge: "supports", dir: "out", maxHops: 2 }],
                actions: [{ id: "attach_support", label: "Attach as support", ops: ["link_edge"], edge: "supports" }]
            },
            {
                id: "contestation",
                title: "Contestation",
                kind: "ContestationStack",
                whenFocus: ["EVI", "CLM"],
                walk: [{ edge: "contests", dir: "in", maxHops: 2 }],
                density: "compact"
            },
            {
                id: "gaps",
                title: "Gaps",
                kind: "LinkList",
                whenFocus: ["EVI", "CLM", "GAP"],
                walk: [{ edge: "gaps_for", dir: "out", maxHops: 1 }],
                actions: [{ id: "declare_gap", label: "Declare gap", ops: ["create_node", "link_edge"], creates: "GAP", edge: "gaps_for" }]
            }
        ],
        allowedOps: ["create_node", "update_node", "link_edge", "unlink_edge", "apply_patch", "revert_patch", "publish"],
        emptyStates: [
            {
                when: "no_roots", message: "No evidence yet. Register an evidence item or ingest a dataset.",
                primaryAction: { id: "register_evidence", label: "Register evidence item", ops: ["create_node"], creates: "EVI" }
            }
        ]
    },

    engage: {
        id: "engage",
        label: "Engage",
        route: "/plan/:planId/engage",
        intent: "Treat disagreement as first-class: representations → issues → responses → plan changes, with publishable summaries.",
        roots: ["REP", "ISS", "RESP", "SOCG"],
        focus: {
            nodeTypes: ["ISS", "REP", "RESP", "SOCG"],
            subfocus: [{ id: "issue_target", label: "Issue target", kind: "IssueTarget" }]
        },
        workSurface: {
            kind: "IssueThread",
            primitives: ["PlanBar", "WorkSurface", "ObjectTile", "PatchEnvelope", "Drawer", "LinkPanel", "TraceStrip"]
        },
        panels: [
            {
                id: "targets",
                title: "Targets",
                kind: "LinkList",
                whenFocus: ["ISS", "REP"],
                walk: [{ edge: "contests", dir: "out", maxHops: 1 }],
                actions: [{ id: "add_target", label: "Add target", ops: ["link_edge"], edge: "contests" }]
            },
            {
                id: "warrants_for_target",
                title: "Warrants (selected target)",
                kind: "WarrantStack",
                whenFocus: ["ISS"],
                walk: [
                    { edge: "supports", dir: "in", maxHops: 2 },
                    { edge: "undermines", dir: "in", maxHops: 2 }
                ],
                actions: [{ id: "attach_support", label: "Attach support", ops: ["link_edge"], edge: "supports" }]
            },
            {
                id: "response_builder",
                title: "Response → Patch",
                kind: "ResponseBuilder",
                whenFocus: ["ISS"],
                actions: [
                    { id: "draft_response", label: "Draft response", ops: ["create_node"], creates: "RESP" },
                    { id: "link_response", label: "Attach response to issue", ops: ["link_edge"], edge: "responds_to" },
                    { id: "generate_patch", label: "Generate patch", ops: ["create_node"], creates: "PATCH" },
                    { id: "link_patch", label: "Link patch to response", ops: ["link_edge"], edge: "results_in" }
                ]
            }
        ],
        allowedOps: ["create_node", "update_node", "link_edge", "unlink_edge", "publish", "apply_patch", "revert_patch"],
        emptyStates: [
            {
                when: "no_roots", message: "No engagement material yet. Ingest representations or open an issue register.",
                primaryAction: { id: "ingest_rep", label: "Ingest representation", ops: ["create_node"], creates: "REP" }
            }
        ]
    },

    scenarios: {
        id: "scenarios",
        label: "Scenarios",
        route: "/plan/:planId/scenarios",
        intent: "Keep alternatives alive: build bundles, evaluate, compare, connect SEA/SA, and propose adoption as patches.",
        roots: ["SCEN", "ALT", "EVAL", "SEA"],
        focus: {
            nodeTypes: ["SCEN", "ALT", "EVAL", "SEA"],
            subfocus: [{ id: "scenario_pair", label: "Scenario pair", kind: "ScenarioPair" }]
        },
        workSurface: {
            kind: "Workbench",
            primitives: ["PlanBar", "WorkSurface", "ObjectTile", "ComparisonSpread", "OverlayLens", "TraceStrip", "PatchEnvelope", "Drawer", "LinkPanel"]
        },
        panels: [
            {
                id: "delta",
                title: "Delta",
                kind: "DeltaStrip",
                whenFocus: ["SCEN", "ALT"],
                walk: [{ edge: "alternative_to", dir: "out", maxHops: 1 }]
            },
            {
                id: "sensitivity",
                title: "Sensitivity",
                kind: "Sensitivity",
                whenFocus: ["EVAL", "SCEN", "ALT"],
                walk: [{ edge: "evaluated_by", dir: "out", maxHops: 1 }]
            },
            {
                id: "sea",
                title: "SEA/SA",
                kind: "SEAWorkbench",
                whenFocus: ["SCEN", "ALT", "SEA"],
                walk: [
                    { edge: "appraised_in", dir: "in", maxHops: 1 },
                    { edge: "mitigated_by", dir: "out", maxHops: 1 },
                    { edge: "recommends_monitoring", dir: "out", maxHops: 1 }
                ],
                actions: [
                    { id: "generate_sea", label: "Generate SEA artefact", ops: ["create_node"], creates: "SEA" },
                    { id: "push_monitoring", label: "Push monitoring measures", ops: ["link_edge"], edge: "recommends_monitoring" }
                ]
            },
            {
                id: "adoption",
                title: "Adoption",
                kind: "LinkList",
                whenFocus: ["SCEN"],
                walk: [{ edge: "proposes_adoption", dir: "out", maxHops: 1 }],
                actions: [{ id: "propose_adoption", label: "Propose adoption (patch)", ops: ["create_node", "link_edge"], creates: "PATCH", edge: "proposes_adoption" }]
            }
        ],
        lenses: [
            {
                id: "lens_scenario_delta",
                label: "Scenario delta",
                kind: "ScenarioDelta",
                edge: "compares_to",
                maxSimultaneous: 2
            }
        ],
        allowedOps: ["create_node", "update_node", "link_edge", "unlink_edge", "apply_patch", "revert_patch", "publish", "supersede"],
        compare: { modes: ["scenario", "object"], allowedTypes: ["SCEN", "ALT", "EVAL", "POL", "ALOC", "DES"] },
        emptyStates: [
            {
                when: "no_roots", message: "No scenarios yet. Create a scenario bundle from the current plan state.",
                primaryAction: { id: "create_scenario", label: "Create scenario", ops: ["create_node"], creates: "SCEN" }
            }
        ]
    },

    monitoring: {
        id: "monitoring",
        label: "Monitoring",
        route: "/plan/:planId/monitoring",
        intent: "Track outcomes and drift: indicators, delivery signals, review triggers, AMR artefacts, and feedback into plan revisions.",
        roots: ["IND", "SER", "DRIFT", "AMR", "REVIEW"],
        focus: { nodeTypes: ["IND", "SER", "DRIFT", "AMR", "REVIEW"] },
        workSurface: {
            kind: "IndicatorBoard",
            primitives: ["PlanBar", "WorkSurface", "ObjectTile", "OverlayLens", "TraceStrip", "PatchEnvelope", "Drawer", "LinkPanel"]
        },
        lenses: [
            {
                id: "lens_drift",
                label: "Delivery drift",
                kind: "DeliveryDrift",
                edge: "signals_drift_on",
                maxSimultaneous: 2
            }
        ],
        panels: [
            {
                id: "drift_queue",
                title: "Drift queue",
                kind: "DriftQueue",
                whenFocus: ["IND", "SER", "DRIFT"],
                walk: [{ edge: "signals_drift_on", dir: "out", maxHops: 1 }],
                actions: [{ id: "open_review", label: "Open review", ops: ["create_node"], creates: "REVIEW" }]
            },
            {
                id: "reality_vs_baseline",
                title: "Reality vs baseline",
                kind: "RealityVsBaseline",
                whenFocus: ["SER", "IND"],
                walk: [{ edge: "compares_to", dir: "out", maxHops: 1 }]
            },
            {
                id: "review_triggers",
                title: "Review triggers",
                kind: "ReviewTriggers",
                whenFocus: ["DRIFT", "REVIEW"],
                walk: [{ edge: "triggers_review", dir: "out", maxHops: 1 }],
                actions: [{ id: "record_decision", label: "Record decision", ops: ["record_decision"], creates: "DEC" }]
            }
        ],
        allowedOps: ["create_node", "update_node", "link_edge", "unlink_edge", "publish", "record_decision", "apply_patch", "revert_patch"],
        emptyStates: [
            {
                when: "no_roots", message: "No indicators yet. Define an indicator framework (national + local outcomes).",
                primaryAction: { id: "create_indicator", label: "Create indicator", ops: ["create_node"], creates: "IND" }
            }
        ]
    }
};
