
import { create } from 'zustand';

interface SelectionState {
    selectedNodeId: string | null;
    selectionHistory: string[];

    // Actions
    selectNode: (nodeId: string | null) => void;
    clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
    selectedNodeId: null,
    selectionHistory: [],

    selectNode: (nodeId) => set((state) => {
        if (!nodeId) return { selectedNodeId: null };
        // Don't duplicate if clicking same
        if (state.selectedNodeId === nodeId) return state;

        return {
            selectedNodeId: nodeId,
            selectionHistory: [...state.selectionHistory, nodeId]
        };
    }),

    clearSelection: () => set({ selectedNodeId: null })
}));
