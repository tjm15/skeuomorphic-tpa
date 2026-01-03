
import React from 'react';
import { WorkSurfaceKind, Primitive } from '@/config/shells';
import { WorkSurface } from '@/ui/primitives/WorkSurface';

// Import Surface Implementations (mock placeholders for now)
import { DeskSurface } from './DeskSurface';
// import { AttentionDeck } from './AttentionDeck';

// ...

export const WorkSurfaceRenderer: React.FC<WorkSurfaceRendererProps> = ({ kind, primitives, planId }) => {
    switch (kind) {
        case 'AttentionDeck': // Config string (keep for now to match shells.ts)
        case 'DeskSurface':   // Future proofing
            return <DeskSurface planId={planId} />;
        case 'Timeline':
            return <Timeline />;
        case 'ObjectSheet':
            return <ObjectSheet />;
        case 'MapCanvas':
            return <MapCanvas />;
        case 'LibraryClaims':
            return <LibraryClaims />;
        case 'IssueThread':
            return <IssueThread />;
        case 'Workbench':
            return <Workbench />;
        case 'IndicatorBoard':
            return <IndicatorBoard />;
        default:
            return (
                <WorkSurface>
                    <div style={{ textAlign: 'center', marginTop: 100, color: 'var(--text-tertiary)' }}>
                        <h2>{kind}</h2>
                        <p>Work Surface implementation pending.</p>
                    </div>
                </WorkSurface>
            );
    }
};
