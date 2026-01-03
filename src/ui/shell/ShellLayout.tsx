
import React from 'react';
import { ShellConfig } from '@/config/shells';
import { PlanBar } from '@/ui/primitives/PlanBar';
import { WorkSurfaceRenderer } from '@/ui/surfaces/WorkSurfaceRenderer';
import { PanelRail } from '@/ui/panels/PanelRail';

interface ShellLayoutProps {
    config: ShellConfig;
    planId: string;
}

import { useEffect } from 'react';
import { useGraphStore } from '@/hooks/useGraphStore';
import { seedRealisticData } from '@/services/dag/mockData';

export const ShellLayout: React.FC<ShellLayoutProps> = ({ config, planId }) => {
    const { store, refresh } = useGraphStore();

    // Init Logic (Seed if empty)
    useEffect(() => {
        if (store.getAllNodes().length === 0) {
            seedRealisticData(store);
            console.log("[ShellLayout] Graph seeded.");
            refresh(); // Force re-render to show data
        }
    }, [store, refresh]);

    // Mock Data for PlanBar (could actully pull from Plan node now)
    const planTitle = "Glazebrook Local Plan";
    const authority = "Glazebrook Council";
    const phase = "Gateway 3 (Submission)";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Top Bar */}
            <PlanBar
                title={planTitle}
                authority={authority}
                phase={phase}
                pressureChips={[
                    { id: '1', label: 'Housing Target', count: 12500, status: 'neutral' },
                    { id: '2', label: 'Unresolved Objections', count: 3, status: 'warning' }
                ]}
            />

            {/* Main Workspace Area (Flex Row) */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Primary Work Surface */}
                <WorkSurfaceRenderer
                    kind={config.workSurface.kind}
                    primitives={config.workSurface.primitives}
                    planId={planId}
                />

                {/* Right Rail (Panels) */}
                <PanelRail config={config.panels} />

            </div>
        </div>
    );
};
