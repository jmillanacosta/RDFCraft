import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import MappingService from '../../lib/api/mapping_service';
import { MappingGraph } from '../../lib/api/mapping_service/types';
import { ZustandActions } from '../../utils/zustand';

interface MappingPageState {
  mapping: MappingGraph | null;
  isLoading: string | null;
  error: string | null;
}

interface MappingPageStateActions {
  loadMapping: (workspaceUuid: string, mappingUuid: string) => Promise<void>;
  saveMapping: (
    workspaceUuid: string,
    mappingUuid: string,
    mapping: MappingGraph,
  ) => Promise<void>;
}

const defaultState: MappingPageState = {
  mapping: null,
  isLoading: null,
  error: null,
};

const functions: ZustandActions<MappingPageStateActions, MappingPageState> = (
  set,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get,
) => ({
  async loadMapping(workspaceUuid: string, mappingUuid: string) {
    set({ isLoading: 'Loading mapping...' });
    try {
      const mapping = await MappingService.getMappingInWorkspace(
        workspaceUuid,
        mappingUuid,
      );
      set({ mapping, error: null });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: null });
    }
  },
  async saveMapping(
    workspaceUuid: string,
    mappingUuid: string,
    mapping: MappingGraph,
  ) {
    set({ isLoading: 'Saving mapping...' });
    try {
      await MappingService.updateMapping(workspaceUuid, mappingUuid, mapping);
      set({ error: null });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: null });
    }
  },
});

export const useMappingPage = create<
  MappingPageState & MappingPageStateActions
>()(
  devtools((set, get) => ({
    ...defaultState,
    ...functions(set, get),
  })),
);

export default useMappingPage;
