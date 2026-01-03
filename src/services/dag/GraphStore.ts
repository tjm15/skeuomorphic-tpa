
import { Node, Edge, ID, NodeType, EdgeType } from './types';

export class GraphStore {
    private _nodes: Map<ID, Node> = new Map();
    private _edges: Map<ID, Edge> = new Map();

    // Basic Indexing
    private _nodesByType: Map<NodeType, Set<ID>> = new Map();
    private _edgesByFrom: Map<ID, Set<ID>> = new Map(); // from_id -> edge_ids
    private _edgesByTo: Map<ID, Set<ID>> = new Map();   // to_id -> edge_ids

    constructor() { }

    // --- Core Mutation ---

    addNode(node: Node): void {
        if (this._nodes.has(node.id)) {
            throw new Error(`Node ${node.id} already exists`);
        }
        this._nodes.set(node.id, node);

        // Index
        if (!this._nodesByType.has(node.type)) {
            this._nodesByType.set(node.type, new Set());
        }
        this._nodesByType.get(node.type)!.add(node.id);
    }

    addEdge(edge: Edge): void {
        if (this._edges.has(edge.id)) {
            throw new Error(`Edge ${edge.id} already exists`);
        }
        // Validation: Nodes must exist (loose validation for now, or strict?)
        // Allowing loose for partial loading, but typically strict is better.
        // Let's warn but allow for now to be flexible with load order if needed.
        if (!this._nodes.has(edge.from_id)) console.warn(`Edge ${edge.id} refers to missing from_id ${edge.from_id}`);
        if (!this._nodes.has(edge.to_id)) console.warn(`Edge ${edge.id} refers to missing to_id ${edge.to_id}`);

        this._edges.set(edge.id, edge);

        // Index From
        if (!this._edgesByFrom.has(edge.from_id)) {
            this._edgesByFrom.set(edge.from_id, new Set());
        }
        this._edgesByFrom.get(edge.from_id)!.add(edge.id);

        // Index To
        if (!this._edgesByTo.has(edge.to_id)) {
            this._edgesByTo.set(edge.to_id, new Set());
        }
        this._edgesByTo.get(edge.to_id)!.add(edge.id);
    }

    // --- Core Query ---

    getNode(id: ID): Node | undefined {
        return this._nodes.get(id);
    }

    getAllNodes(): Node[] {
        return Array.from(this._nodes.values());
    }

    getEdge(id: ID): Edge | undefined {
        return this._edges.get(id);
    }

    getNodesByType(type: NodeType): Node[] {
        const ids = this._nodesByType.get(type);
        if (!ids) return [];
        return Array.from(ids).map(id => this._nodes.get(id)!);
    }

    // Ownership Tree Query
    getChildren(ownerId: ID): Node[] {
        // Scan all nodes? Or should we index owner_id?
        // Optimization: Index owner_id if frequently used. For now, filter is okay for small graphs.
        // Let's add an index for owner_id to be safe.
        return Array.from(this._nodes.values()).filter(n => n.owner_id === ownerId);
    }

    // Traversal
    getOutboundEdges(nodeId: ID, type?: EdgeType): Edge[] {
        const edgeIds = this._edgesByFrom.get(nodeId);
        if (!edgeIds) return [];
        const edges = Array.from(edgeIds).map(id => this._edges.get(id)!);
        if (type) return edges.filter(e => e.type === type);
        return edges;
    }

    getInboundEdges(nodeId: ID, type?: EdgeType): Edge[] {
        const edgeIds = this._edgesByTo.get(nodeId);
        if (!edgeIds) return [];
        const edges = Array.from(edgeIds).map(id => this._edges.get(id)!);
        if (type) return edges.filter(e => e.type === type);
        return edges;
    }
}
