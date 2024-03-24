import { ZustandActions } from '@/lib/global';
import { MappingDocument, MappingModel } from '@/lib/models/MappingModel';
import { WorkspaceModel } from '@/lib/models/Workspace';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type MappingState = {
    workspace: WorkspaceModel | null;
    mappingDocument: MappingDocument | null;
    loading: boolean;
    error: string | null;
};

type MappingActions = {
    fetch: (workspaceId: string, mappingId: string) => void;
    save: (mappingModel: MappingModel) => void;
};

const defaultState: MappingState = {
    workspace: null,
    mappingDocument: null,
    loading: false,
    error: null,
};

const functions: ZustandActions<MappingActions, MappingState> = (set, get) => ({
    fetch: async (workspaceId: string, mappingId: string) => {
        set({
            loading: true,
        });
        try {
            // Fetch the mapping document
            // Fetch the workspace
            // Set the mapping document and workspace
            set({ loading: false });
        } catch (error) {
            set({ error: 'An unexpected error occurred', loading: false });
        }
    },
    save: async (mappingModel: MappingModel) => {
        try {
            // Save the mapping document
            // Save the workspace
            set({ loading: false });
        } catch (error) {
            set({ error: 'An unexpected error occurred', loading: false });
        }
    },
});

const useMappingStore = create<MappingState & MappingActions>()(
    devtools(
        (set, get) => ({
            ...defaultState,
            ...functions(set, get),
        }),
        {
            name: 'MappingStore',
        },
    ),
);

export default useMappingStore;
