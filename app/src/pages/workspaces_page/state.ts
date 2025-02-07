import {
  CreateWorkspaceMetadata,
  Workspace,
} from '../../lib/api/workspaces_api/types';

import ApiService from '@/lib/services/api_service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import WorkspacesApi from '../../lib/api/workspaces_api';
import { ZustandActions } from '../../utils/zustand';

interface WorkspacesPageState {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
}

interface WorkspacesPageStateActions {
  createWorkspace: (workspace: CreateWorkspaceMetadata) => void;
  exportWorkspace: (workspace: Workspace) => void;
  importWorkspace: (data: File) => void;
  refreshWorkspaces: () => void;
  deleteWorkspace: (workspace: Workspace) => void;
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
  deleteWorkspace(workspace) {
    set({ isLoading: true });
    WorkspacesApi.deleteWorkspace(workspace.uuid)
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
  exportWorkspace(workspace) {
    const a = document.createElement('a');
    a.href = `${ApiService.getInstance('default').baseUrl}workspaces/${workspace.uuid}/export`;
    a.click();
  },
  importWorkspace(data) {
    set({ isLoading: true });
    WorkspacesApi.importWorkspace(data)
      .then(() => {
        get().refreshWorkspaces();
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
