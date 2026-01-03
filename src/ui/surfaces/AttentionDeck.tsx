
import React from 'react';
import { WorkSurface } from '@/ui/primitives/WorkSurface';
import { ObjectCard } from '@/ui/common/ObjectCard';
import { useGraphStore } from '@/hooks/useGraphStore';
import { NodeType } from '@/services/dag/types';
import { useSelectionStore } from '@/state/useSelectionStore';

export const AttentionDeck: React.FC = () => {
    const { store } = useGraphStore();
    const { selectedNodeId, selectNode } = useSelectionStore();

    // Fetch all nodes for the "Attention Deck" (could be filtered by status/pressure)
    const allNodes = store.getAllNodes();

    // Simple filter for demo
    const displayNodes = allNodes.filter(n =>
        [NodeType.POL, NodeType.EVI, NodeType.ISS].includes(n.type)
    ).slice(0, 6);

    const getCardType = (nodeType: NodeType): any => {
        if (nodeType === NodeType.POL) return 'policy';
        if (nodeType === NodeType.EVI) return 'evidence';
        if (nodeType === NodeType.ISS) return 'issue';
        return 'policy'; // Fallback
    };

    return (
        <WorkSurface>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {displayNodes.map(node => (
                    <div key={node.id} onClick={() => selectNode(node.id)} style={{ cursor: 'pointer' }}>
                        <ObjectCard
                            title={(node.data as any).title || "Untitled"}
                            type={getCardType(node.type)}
                            status={(node.data as any).status || "draft"}
                            isBound={false}
                            edgeChips={
                                // Mock chips for now until we have a nice helper
                                node.type === NodeType.EVI ? [{ type: 'supports', count: 1 }] : undefined
                            }
                            // Visual indicator for selection
                            style={selectedNodeId === node.id ? { outline: '2px solid var(--accent-primary)', transform: 'scale(1.02)' } : undefined}
                        >
                            {(node.data as any).text || "No summary available."}
                        </ObjectCard>
                    </div>
                ))}

                {displayNodes.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-tertiary)', marginTop: 40 }}>
                        No items on deck.
                    </div>
                )}
            </div>
        </WorkSurface>
    );
};
