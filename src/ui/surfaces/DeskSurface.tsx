import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGraphStore } from '@/hooks/useGraphStore';
import { useSelectionStore } from '@/state/useSelectionStore';
import { NodeType } from '@/services/dag/types';
import { ObjectCard } from '@/ui/common/ObjectCard';
import styles from './DeskSurface.module.css';

// Helper to scatter cards randomly but somewhat centrally
const getRandomPos = (idx: number) => {
    // Spiral or random scatter? Random for now.
    const offsetX = Math.random() * 600 - 300; // +/- 300px
    const offsetY = Math.random() * 400 - 200; // +/- 200px
    return { x: offsetX, y: offsetY, r: Math.random() * 10 - 5 }; // Slight rotation
};

export const DeskSurface: React.FC<{ planId: string }> = ({ planId }) => {
    const { store } = useGraphStore();
    const { selectedNodeId, selectNode } = useSelectionStore();

    // Get interesting nodes
    const nodes = useMemo(() => {
        const all = store.getAllNodes();
        // Filter for "Desk Items" (Policies, Sites, Evidence, Issues)
        return all.filter(n => [NodeType.POL, NodeType.SITE, NodeType.EVI, NodeType.ISS].includes(n.type));
    }, [store]); // Re-calc when store changes/init

    // Store positions in local state to persist during drag
    // Key: nodeId, Value: {x, y, r}
    const [positions, setPositions] = useState<Record<string, { x: number, y: number, r: number }>>({});

    // Init positions once nodes are loaded
    useEffect(() => {
        if (nodes.length > 0 && Object.keys(positions).length === 0) {
            const newPos: Record<string, any> = {};
            nodes.forEach((n, i) => {
                const pos = getRandomPos(i);
                // Center roughly in viewport (assuming 1920/2ish)
                // Let's just use 0,0 as center of "Desk" and translate container?
                // Or just absolute from top-left?
                // Let's assume a viewport of ~1200x800 available.
                newPos[n.id] = {
                    x: 100 + Math.random() * 800,
                    y: 100 + Math.random() * 400,
                    r: Math.random() * 6 - 3
                };
            });
            setPositions(newPos);
        }
    }, [nodes]);

    const getCardType = (t: NodeType): any => {
        if (t === NodeType.POL) return 'policy';
        if (t === NodeType.SITE) return 'site';
        if (t === NodeType.EVI) return 'evidence';
        if (t === NodeType.ISS) return 'issue';
        return 'policy';
    };

    return (
        <div className={styles.deskContainer}>
            {nodes.length === 0 && <div className={styles.emptyState}>Desk is empty.</div>}

            {nodes.map(node => {
                const pos = positions[node.id] || { x: 0, y: 0, r: 0 };
                const isSelected = selectedNodeId === node.id;

                return (
                    <motion.div
                        key={node.id}
                        className={styles.cardWrapper}
                        initial={{ x: pos.x, y: pos.y, rotate: pos.r, opacity: 0, scale: 0.8 }}
                        animate={{
                            x: pos.x,
                            y: pos.y,
                            rotate: isSelected ? 0 : pos.r, // Straighten when selected
                            opacity: 1,
                            scale: isSelected ? 1.05 : 1,
                            zIndex: isSelected ? 100 : 10
                        }}
                        drag
                        dragMomentum={false} // Heavy paper feel
                        onDragEnd={(_, info) => {
                            // Update local pos state
                            // Note: framer motion handles the visual transform, 
                            // but if we want to persist across re-renders we should update state.
                            // For this demo, Framer keeps state in DOM unless we fully unmount.
                            // But let's update state to be safe?
                            // Actually, standard framer motion drag keeps visual state.
                            // We only need to update if we save to backend.
                        }}
                        onPointerDown={() => selectNode(node.id)}
                    >
                        <div style={{ width: 320 }}>
                            <ObjectCard
                                title={(node.data as any).title || "Untitled"}
                                type={getCardType(node.type)}
                                status={(node.data as any).status}
                                style={{
                                    boxShadow: isSelected
                                        ? '0 20px 40px rgba(0,0,0,0.3)' // Lift up
                                        : '0 4px 10px rgba(0,0,0,0.1)' // Flat on desk
                                }}
                            >
                                <div style={{
                                    maxHeight: 100,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {(node.data as any).text || (node.data as any).description || "Double-click to read more..."}
                                </div>
                            </ObjectCard>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
