
import React from 'react';
import { PanelConfig } from '@/config/shells';
import { useGraphNeighbors } from '@/hooks/useGraphStore';
import { EdgeType } from '@/services/dag/types';
import { GlassCard } from '@/ui/common/GlassCard';
import { useSelectionStore } from '@/state/useSelectionStore';

interface WarrantStackPanelProps {
    config: PanelConfig;
}

export const WarrantStackPanel: React.FC<WarrantStackPanelProps> = ({ config }) => {
    const { selectedNodeId } = useSelectionStore();

    const supports = useGraphNeighbors(selectedNodeId || '', EdgeType.SUPPORTS, 'in');
    const undermines = useGraphNeighbors(selectedNodeId || '', EdgeType.UNDERMINES, 'in');

    if (!selectedNodeId) {
        return (
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    Select an item to view warrants.
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Supports Section */}
                <div>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                        Supports <span>{supports.length}</span>
                    </h4>
                    {supports.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {supports.filter(n => n !== undefined).map(node => (
                                <GlassCard key={node!.id} style={{ padding: '8px 10px', fontSize: '0.85rem' }}>
                                    {(node!.data as any).title || "Untitled Support"}
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: 8, background: 'rgba(0,255,0,0.03)', border: '1px solid rgba(0,255,0,0.1)', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            No supporting evidence linked.
                        </div>
                    )}
                </div>

                {/* Undermines Section */}
                <div>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                        Undermines <span>{undermines.length}</span>
                    </h4>
                    {undermines.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {undermines.filter(n => n !== undefined).map(node => (
                                <GlassCard key={node!.id} style={{ padding: '8px 10px', fontSize: '0.85rem', borderColor: 'var(--border-warning)' }}>
                                    {(node!.data as any).title || "Untitled Objection"}
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: 8, background: 'rgba(255,0,0,0.03)', border: '1px solid rgba(255,0,0,0.1)', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            No undermining claims linked.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
