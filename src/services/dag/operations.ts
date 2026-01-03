
import { GraphStore } from './GraphStore';
import { Node, Edge, NodeType, EdgeType, ID } from './types';
// import { v4 as uuidv4 } from 'uuid'; -- removed to avoid dep issues
const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// NOTE: I will use a simple random ID generator to avoid dependency issues if uuid is not installed,
// but usually it is. Let's use a simple helper.

const generateId = (prefix: string = 'node') => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const now = () => new Date().toISOString();

export class DagOperations {
    constructor(private store: GraphStore) { }

    // --- Primitives ---

    createNode<T>(
        type: NodeType,
        data: T,
        ownerId?: ID,
        title?: string,
        id?: ID // Optional override
    ): Node<T> {
        const node: Node<T> = {
            id: id || generateId(type),
            type,
            title,
            owner_id: ownerId,
            data,
            created_at: now(),
            updated_at: now(),
        };
        this.store.addNode(node);
        return node;
    }

    createEdge(
        type: EdgeType,
        fromId: ID,
        toId: ID,
        meta?: Record<string, any>
    ): Edge {
        const edge: Edge = {
            id: generateId('edge'),
            type,
            from_id: fromId,
            to_id: toId,
            meta,
            created_at: now(),
        };
        this.store.addEdge(edge);
        return edge;
    }

    // --- Higher Level ---

    linkEvidence(evidenceId: ID, targetId: ID, supports: boolean = true, meta?: any) {
        return this.createEdge(
            supports ? EdgeType.SUPPORTS : EdgeType.UNDERMINES,
            evidenceId,
            targetId,
            meta
        );
    }

    supersedeNode(oldNodeId: ID, newData: any, reason?: string) {
        const oldNode = this.store.getNode(oldNodeId);
        if (!oldNode) throw new Error('Old node not found');

        // 1. Create new node (clone + update)
        const newNode = this.createNode(
            oldNode.type,
            newData, // New payload
            oldNode.owner_id, // Same owner (same place in tree)
            oldNode.title // Keep title or update? usually keep.
        );

        // 2. Create Supersedes Edge: New -> Old
        this.createEdge(
            EdgeType.SUPERSEDES,
            newNode.id,
            oldNode.id,
            { reason }
        );

        return newNode;
    }
}
