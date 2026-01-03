import { create } from 'zustand';
import { planService } from '@/services';
import { Plan, Policy, Site, EvidenceItem, Issue, MonitoringSignal, PatchBundle, Scenario } from '@/services/types';

interface PlanState {

    // Data
    currentPlan: Plan | null;
    policies: Policy[];
    sites: Site[];
    evidence: EvidenceItem[];
    issues: Issue[];
    signals: MonitoringSignal[];
    scenarios: Scenario[];

    // UI State
    isLoading: boolean;
    activePatchBundle: PatchBundle | null;
    isPatchDrawerOpen: boolean;

    // Actions
    loadPlan: (planId: string) => Promise<void>;
    openPatchReview: (bundle: PatchBundle) => void;
    closePatchDrawer: () => void;
    refreshData: () => Promise<void>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
    currentPlan: null,
    policies: [],
    sites: [],
    evidence: [],
    issues: [],
    signals: [],
    scenarios: [],

    isLoading: false,
    activePatchBundle: null,
    isPatchDrawerOpen: false,

    loadPlan: async (planId: string) => {
        set({ isLoading: true });
        try {
            const plan = await planService.getPlan(planId);
            if (!plan) throw new Error('Plan not found');

            const [policies, sites, evidence, issues, signals, scenarios] = await Promise.all([
                planService.listPolicies(planId),
                planService.listSites(planId),
                planService.listEvidence(planId),
                planService.listIssues(planId),
                planService.listMonitoringSignals(planId),
                planService.listScenarios(planId)
            ]);

            set({
                currentPlan: plan,
                policies,
                sites,
                evidence,
                issues,
                signals,
                scenarios,
                isLoading: false
            });
        } catch (e) {
            console.error(e);
            set({ isLoading: false });
        }
    },

    refreshData: async () => {
        const { currentPlan } = get();
        if (currentPlan) {
            await get().loadPlan(currentPlan.id);
        }
    },

    openPatchReview: (bundle: PatchBundle) => {
        set({ activePatchBundle: bundle, isPatchDrawerOpen: true });
    },

    closePatchDrawer: () => {
        set({ isPatchDrawerOpen: false, activePatchBundle: null });
    }
}));
