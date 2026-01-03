import {
    Plan, Policy, Site, EvidenceItem, Scenario, Issue, PatchBundle, GatewayCut,
    MonitoringSignal, ID
} from './types';

export interface PlanService {
    // Read
    getPlan(planId: string): Promise<Plan | null>;
    listPolicies(planId: string): Promise<Policy[]>;
    listSites(planId: string): Promise<Site[]>;
    listEvidence(planId: string): Promise<EvidenceItem[]>;
    listScenarios(planId: string): Promise<Scenario[]>;
    listIssues(planId: string): Promise<Issue[]>;
    listMonitoringSignals(planId: string): Promise<MonitoringSignal[]>;

    getPolicy(id: ID): Promise<Policy | null>;
    getSite(id: ID): Promise<Site | null>;

    // AI Ops / Write
    proposePolicyEdits(planId: ID, policyId: ID, intent: string): Promise<PatchBundle>;
    generateSiteAssessment(planId: ID, siteId: ID): Promise<{ issues: Issue[], patches?: PatchBundle }>;
    runGatewayCut(planId: ID, gatewayId: string): Promise<GatewayCut>;

    applyPatchBundle(planId: ID, bundleId: ID): Promise<void>;
    rejectPatchBundle(planId: ID, bundleId: ID): Promise<void>;
}
