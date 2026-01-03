
import React from 'react';
import { PanelConfig } from '@/config/shells';
import { GlassCard } from '@/ui/common/GlassCard';
import { useGraphNeighbors } from '@/hooks/useGraphStore';
import { EdgeType } from '@/services/dag/types';
import { useSelectionStore } from '@/state/useSelectionStore';

interface LinkListPanelProps {
    config: PanelConfig;
}

export const LinkListPanel: React.FC<LinkListPanelProps> = ({ config }) => {
    const { selectedNodeId } = useSelectionStore();

    // NOTE: If no selection, we could show global items, but for now let's just use empty or placeholder.
    // Ideally we might default to a root node or latest active.

    // Parse the walk config (simplify to single step for now)
    const step = config.walk?.[0];
    const edgeType = step?.edge as EdgeType;
    const dir = step?.dir || 'out';

    const items = useGraphNeighbors(selectedNodeId || '', edgeType, dir);

    const displayItems = items.filter(n => n !== undefined).map(node => ({
        id: node!.id,
        title: (node!.data as any).title || (node!.data as any).text?.substring(0, 30) + '...',
        type: node!.type,
        due: 'TBD'
    }));

    if (config.id === 'recent_changes') {
        // Keep mock for customized panel
        return (
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <GlassCard style={{ padding: 10 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Policy H1</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Updated text • 2h ago</div>
                    </GlassCard>
                </div>
            </div>
        );
    }

    if (!selectedNodeId) {
        return (
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    Select an item to view links.
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>{config.title}</h3>
            {displayItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {displayItems.map(item => (
                        <GlassCard key={item.id} style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.type} • {item.due}</div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', padding: '8px 0' }}>
                    No items found.
                </div>
            )}
        </div>
    );
};
