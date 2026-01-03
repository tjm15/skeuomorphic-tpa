import { PlanService } from './PlanService';
import {
    Plan, Policy, Site, EvidenceItem, Scenario, Issue, PatchBundle, GatewayCut,
    MonitoringSignal, ID, PatchOp, JudgementTrace
} from './types';
import { SEED_PLAN, SEED_POLICIES, SEED_SITES, SEED_EVIDENCE, SEED_ISSUES, SEED_MONITORING } from '../mock/seed';

// Utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockPlanService implements PlanService {
    private plan: Plan = { ...SEED_PLAN };
    private policies: Policy[] = [...SEED_POLICIES];
    private sites: Site[] = [...SEED_SITES];
    private evidence: EvidenceItem[] = [...SEED_EVIDENCE];
    private issues: Issue[] = [...SEED_ISSUES];
    private signals: MonitoringSignal[] = [...SEED_MONITORING];
    private scenarios: Scenario[] = [];

    private patches: Record<ID, PatchBundle> = {};

    async getPlan(planId: string): Promise<Plan | null> {
        await delay(300);
        return this.plan.id === planId ? this.plan : null;
    }

    async listPolicies(planId: string): Promise<Policy[]> {
        await delay(300);
        return this.policies.filter(p => p.planId === planId);
    }

    async listSites(planId: string): Promise<Site[]> {
        await delay(300);
        return this.sites.filter(s => s.planId === planId);
    }

    async listEvidence(planId: string): Promise<EvidenceItem[]> {
        await delay(300);
        return this.evidence.filter(e => e.planId === planId);
    }

    async listScenarios(planId: string): Promise<Scenario[]> {
        await delay(300);
        return this.scenarios.filter(s => s.planId === planId);
    }

    async listIssues(planId: string): Promise<Issue[]> {
        await delay(300);
        return this.issues.filter(i => i.planId === planId);
    }

    async listMonitoringSignals(planId: string): Promise<MonitoringSignal[]> {
        await delay(300);
        return this.signals.filter(s => s.planId === planId);
    }

    async getPolicy(id: ID): Promise<Policy | null> {
        await delay(100);
        return this.policies.find(p => p.id === id) || null;
    }

    async getSite(id: ID): Promise<Site | null> {
        await delay(100);
        return this.sites.find(s => s.id === id) || null;
    }

    // --- AI Operations ---

    async proposePolicyEdits(planId: ID, policyId: ID, intent: string): Promise<PatchBundle> {
        await delay(1500); // Simulate AI thinking

        // Deterministic mock response
        const policy = this.policies.find(p => p.id === policyId);
        if (!policy) throw new Error('Policy not found');

        const patchBundle: PatchBundle = {
            id: `PB-${Date.now()}`,
            planId,
            title: `AI Edit: ${intent}`,
            description: `Proposed amendments to align with: "${intent}". Focused on clarifying obligations.`,
            status: 'pending',
            patches: [
                {
                    op: 'update',
                    path: `policies/${policyId}/text`,
                    value: policy.text + '\n\n**New Clause:** This requirement is subject to viability assessment.'
                }
            ],
            trace: {
                reasoning: 'Standard viability clause added to prevent rigid application blocking development.',
                citations: ['EV-001'],
                model: 'tpa-reasoning-v1'
            },
            createdAt: new Date().toISOString()
        };

        // Store it temporarily (mocking persistence of pending bundles)
        this.patches[patchBundle.id] = patchBundle;

        return patchBundle;
    }

    async generateSiteAssessment(planId: ID, siteId: ID): Promise<{ issues: Issue[], patches?: PatchBundle }> {
        await delay(2000);

        const newIssues: Issue[] = [
            {
                id: `ISS-${Date.now()}`,
                planId,
                title: 'Flood Risk Conflict',
                description: 'Site intersects with Flood Zone 3b, contrary to NPPF.',
                severity: 'high',
                type: 'contradiction',
                relatedObjectIds: [siteId],
                resolved: false
            }
        ];

        this.issues.push(...newIssues);

        return { issues: newIssues };
    }

    async runGatewayCut(planId: ID, gatewayId: string): Promise<GatewayCut> {
        await delay(2500); // Heavy op

        return {
            id: `GW-${Date.now()}`,
            planId,
            gatewayName: gatewayId,
            status: 'fail', // Force fail for demo
            checkPerformedAt: new Date().toISOString(),
            issuesFound: ['ISS-001'],
            missingItems: ['Viability Assessment for H1', 'Transport Statement for SITE-001'],
            score: 65
        };
    }

    async applyPatchBundle(planId: ID, bundleId: ID): Promise<void> {
        const bundle = this.patches[bundleId]; // In real app, fetch from DB
        if (!bundle) {
            // If passed directly or just mocked
            console.warn("Patch bundle not found in memory, assuming passed object in real flow or just mocking success");
            return;
        }

        // Apply patches
        for (const patch of bundle.patches) {
            if (patch.path.startsWith('policies/')) {
                const policyId = patch.path.split('/')[1];
                const attr = patch.path.split('/')[2];
                const policy = this.policies.find(p => p.id === policyId);
                if (policy && attr === 'text') {
                    policy.text = patch.value;
                    policy.version += 1;
                }
            }
        }

        bundle.status = 'accepted';
    }

    async rejectPatchBundle(planId: ID, bundleId: ID): Promise<void> {
        const bundle = this.patches[bundleId];
        if (bundle) bundle.status = 'rejected';
    }
}
