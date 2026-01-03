
import React from 'react';
import { WorkSurface } from '@/ui/primitives/WorkSurface';
import { useGraphStore } from '@/hooks/useGraphStore';
import { NodeType } from '@/services/dag/types';
import { ObjectCard } from '@/ui/common/ObjectCard';
import { useSelectionStore } from '@/state/useSelectionStore';

export const ObjectSheet: React.FC = () => {
    const { store } = useGraphStore();
    const { selectedNodeId, selectNode } = useSelectionStore();

    // Fetch all Policy nodes
    const policies = store.getAllNodes().filter(n => n.type === NodeType.POL);

    return (
        <WorkSurface>
            <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 24, paddingLeft: 8 }}>
                    Strategic Policies ({policies.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {policies.map(node => (
                        <div key={node.id} onClick={() => selectNode(node.id)} style={{ cursor: 'pointer' }}>
                            <ObjectCard
                                title={(node.data as any).title || "Untitled Policy"}
                                type="policy"
                                status={(node.data as any).status || "draft"}
                                isBound={false}
                                style={selectedNodeId === node.id ? { outline: '2px solid var(--accent-primary)', transform: 'scale(1.02)' } : undefined}
                            >
                                {(node.data as any).text || "No policy text."}
                            </ObjectCard>
                        </div>
                    ))}

                    {policies.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                            No policies found in the graph.
                        </div>
                    )}
                </div>
            </div>
        </WorkSurface>
    );
};
