
import { useState, useEffect } from 'react';
import { GraphStore } from '../services/dag/GraphStore';
// import { seedGraph } from '../services/dag/mockData';
import { Node, NodeType, EdgeType } from '../services/dag/types';

// Singleton Store instance
const globalStore = new GraphStore();
// const rootId = seedGraph(globalStore); // Removed: Graph seeded by Shell / Views

export function useGraphStore() {
    // Simple force-update mechanism for now (real app would use subscription)
    const [version, setVersion] = useState(0);

    const refresh = () => setVersion(v => v + 1);

    return {
        store: globalStore,
        // rootId, // Deprecated
        refresh
    };
}

export function useGraphNode<T>(nodeId: string | null) {
    const { store } = useGraphStore();
    return nodeId ? store.getNode(nodeId) as Node<T> | undefined : undefined;
}

export function useGraphNeighbors(nodeId: string | null, edgeType: EdgeType, direction: 'in' | 'out') {
    const { store } = useGraphStore();
    if (!nodeId) return [];

    if (direction === 'out') {
        const edges = store.getOutboundEdges(nodeId).filter(e => e.type === edgeType);
        return edges.map(e => store.getNode(e.to_id));
    } else {
        const edges = store.getInboundEdges(nodeId).filter(e => e.type === edgeType);
        return edges.map(e => store.getNode(e.from_id));
    }
}
