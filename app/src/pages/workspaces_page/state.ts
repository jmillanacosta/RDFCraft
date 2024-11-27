import {
  CreateWorkspaceMetadata,
  WorkspaceMetadata,
} from '../../lib/api/workspaces_api/types';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import WorkspacesApi from '../../lib/api/workspaces_api';
import { ZustandActions } from '../../utils/zustand';

interface WorkspacesPageState {
  workspaces: WorkspaceMetadata[];
  isLoading: boolean;
  error: string | null;
}

interface WorkspacesPageStateActions {
  createWorkspace: (workspace: CreateWorkspaceMetadata) => void;
  refreshWorkspaces: () => void;
}

const defaultState: WorkspacesPageState = {
  workspaces: [],
  isLoading: false,
  error: null,
};

const functions: ZustandActions<
  WorkspacesPageStateActions,
  WorkspacesPageState
> = (set, get) => ({
  createWorkspace(workspace) {
    set({ isLoading: true });
    WorkspacesApi.createWorkspace(workspace)
      .then(result => {
        if (result) {
          get().refreshWorkspaces();
        }
      })
      .catch(error => {
        if (error instanceof Error) {
          set({ error: error.message });
        }
      })
      .finally(() => {
        set({ isLoading: false });
      });
  },
  refreshWorkspaces() {
    set({ isLoading: true });
    WorkspacesApi.getWorkspaces()
      .then(workspaces => {
        set({ workspaces, error: null });
      })
      .catch(error => {
        if (error instanceof Error) {
          set({ error: error.message });
        }
      })
      .finally(() => {
        set({ isLoading: false });
      });
  },
});

const useWorkspacesPageState = create<
  WorkspacesPageState & WorkspacesPageStateActions
>()(
  devtools(
    (set, get) => ({
      ...defaultState,
      ...functions(set, get),
    }),
    {
      name: 'workspaces-page',
    },
  ),
);

export default useWorkspacesPageState;
