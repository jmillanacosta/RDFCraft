'use client';

import WorkspaceService from '@/lib/api/WorkspaceService';
import { WorkspaceModel } from '@/lib/models/Workspace';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type WorkspaceStoreState = {
  loading: boolean;
  workspaces: WorkspaceModel[];
  error: string | null;
};

const defaultState: WorkspaceStoreState = {
  loading: false,
  workspaces: [],
  error: null,
};

type WorkspaceStoreActions = {
  fetch: () => void;
  create: (name: string, description: string) => void;
  delete: (id: string) => void;
};

const useWorkspaceStore = create<WorkspaceStoreState & WorkspaceStoreActions>()(
  devtools((set, get) => ({
    ...defaultState,
    fetch: async () => {
      set({ loading: true });
      try {
        const workspaces = await WorkspaceService.fetchAllWorkspaces();
        if (workspaces.success) {
          set({ workspaces: workspaces.data, loading: false });
          return;
        }
        set({ error: workspaces.message, loading: false });
      } catch (error) {
        set({ error: 'An unexpected error occurred', loading: false });
      }
    },
    create: async (name, description) => {
      try {
        const response = await WorkspaceService.createWorkspace(
          name,
          description,
        );
        if (!response.success) {
          set({ error: response.message });
          return;
        }
        get().fetch();
      } catch (error) {
        set({ error: 'An unexpected error occurred' });
      }
    },
    delete: async id => {
      try {
        const response = await WorkspaceService.deleteWorkspace(id);
        if (!response.success) {
          set({ error: response.message });
          return;
        }
        get().fetch();
      } catch (error) {
        set({ error: 'An unexpected error occurred' });
      }
    },
  })),
);

export default useWorkspaceStore;
