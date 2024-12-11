import { Workspace } from '../../lib/api/workspaces_api/types';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import WorkspacesApi from '../../lib/api/workspaces_api';
import { ZustandActions } from '../../utils/zustand';

interface WorkspacePageState {
  workspace: Workspace | null;
  isLoading: string | null; // If the value is null, it means that the data is not being loaded, otherwise it will contain the loading message
  error: string | null;
}

interface WorkspacePageStateActions {
  loadWorkspace: (uuid: string) => void;
}

const defaultState: WorkspacePageState = {
  workspace: null,
  isLoading: null,
  error: null,
};

const functions: ZustandActions<
  WorkspacePageStateActions,
  WorkspacePageState
> = set => ({
  loadWorkspace(uuid) {
    set({ isLoading: 'Loading workspace...' });
    WorkspacesApi.getWorkspace(uuid)
      .then(workspace => {
        set({ workspace, error: null });
      })
      .catch(error => {
        if (error instanceof Error) {
          set({ error: error.message });
        }
      })
      .finally(() => {
        set({ isLoading: null });
      });
  },
});

const useWorkspacePageState = create<
  WorkspacePageState & WorkspacePageStateActions
>()(
  devtools((set, get) => ({
    ...defaultState,
    ...functions(set, get),
  })),
);

export default useWorkspacePageState;
