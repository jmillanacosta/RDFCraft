import { Workspace } from '../../lib/api/workspaces_api/types';

import ApiService from '@/lib/services/api_service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import MappingService from '../../lib/api/mapping_service';
import { MappingGraph } from '../../lib/api/mapping_service/types';
import WorkspacesApi from '../../lib/api/workspaces_api';
import { ZustandActions } from '../../utils/zustand';

interface WorkspacePageState {
  workspace: Workspace | null;
  mappingGraphs: MappingGraph[];
  isLoading: string | null; // If the value is null, it means that the data is not being loaded, otherwise it will contain the loading message
  error: string | null;
}

interface WorkspacePageStateActions {
  loadWorkspace: (uuid: string) => Promise<void>;
  createMapping: (
    workspaceUuid: string,
    name: string,
    description: string,
    content: File,
    sourceType: 'csv' | 'json',
    extra: Record<string, unknown>,
  ) => Promise<void>;
  deleteMapping: (workspaceUuid: string, mappingUuid: string) => Promise<void>;
  exportMapping: (workspaceUuid: string, mappingUuid: string) => Promise<void>;
  importMapping: (workspaceUuid: string, data: File) => Promise<void>;
}

const defaultState: WorkspacePageState = {
  workspace: null,
  mappingGraphs: [],
  isLoading: null,
  error: null,
};

const functions: ZustandActions<
  WorkspacePageStateActions,
  WorkspacePageState
> = (set, get) => ({
  async loadWorkspace(uuid) {
    set({ isLoading: 'Loading workspace...' });
    try {
      const workspacePromise = WorkspacesApi.getWorkspace(uuid);
      const mappingGraphsPromise = await MappingService.getMappingsInWorkspace(
        uuid,
      );
      // Wait for all the promises to resolve
      const [workspace, mappingGraphs] = await Promise.all([
        workspacePromise,
        mappingGraphsPromise,
      ]);
      set({ workspace, mappingGraphs, error: null });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: null });
    }
  },
  async createMapping(
    workspaceUuid,
    name,
    description,
    content,
    sourceType,
    extra,
  ) {
    set({ isLoading: 'Creating mapping...' });
    MappingService.createMappingInWorkspace(
      workspaceUuid,
      name,
      description,
      content,
      sourceType,
      extra,
    )
      .then(() => {
        return get().loadWorkspace(workspaceUuid);
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
  async deleteMapping(workspaceUuid, mappingUuid) {
    set({ isLoading: 'Deleting mapping...' });
    MappingService.deleteMappingInWorkspace(workspaceUuid, mappingUuid)
      .then(() => {
        return get().loadWorkspace(workspaceUuid);
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
  async exportMapping(workspaceUuid, mappingUuid) {
    set({ isLoading: 'Exporting mapping...' });
    const a = document.createElement('a');
    a.href = `${ApiService.getInstance('default').baseUrl}workspaces/${workspaceUuid}/mapping/${mappingUuid}/export`;
    a.click();
    set({ isLoading: null });
  },
  async importMapping(workspaceUuid, data) {
    set({ isLoading: 'Importing mapping...' });
    MappingService.importMapping(data, workspaceUuid)
      .then(() => {
        return get().loadWorkspace(workspaceUuid);
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
