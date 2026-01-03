
import React from 'react';
import { PanelConfig } from '@/config/shells';
import { useGraphNeighbors } from '@/hooks/useGraphStore';
import { EdgeType } from '@/services/dag/types';
import { GlassCard } from '@/ui/common/GlassCard';
import { useSelectionStore } from '@/state/useSelectionStore';

interface ContestationStackPanelProps {
    config: PanelConfig;
}

export const ContestationStackPanel: React.FC<ContestationStackPanelProps> = ({ config }) => {
    const { selectedNodeId } = useSelectionStore();

    const issues = useGraphNeighbors(selectedNodeId || '', EdgeType.CONTESTS, 'in');

    if (!selectedNodeId) {
        return (
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    Select an item to view contests.
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>

            {issues.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {issues.filter(n => n !== undefined).map(node => (
                        <GlassCard key={node!.id} style={{ padding: 10, borderLeft: '3px solid var(--border-warning)' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
                                {(node!.data as any).title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Open Issue • 3 Responses
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', padding: '8px 0', fontStyle: 'italic' }}>
                    No active contests.
                </div>
            )}
        </div>
    );
};
