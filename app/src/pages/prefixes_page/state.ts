import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import PrefixApi from '../../lib/api/prefix_api';
import { Prefix } from '../../lib/api/prefix_api/types';
import { ZustandActions } from '../../utils/zustand';

interface PrefixesPageState {
  prefixes: Prefix[] | null;
  isLoading: string | null; // If the value is null, it means that the data is not being loaded, otherwise it will contain the loading message
  error: string | null;
}

interface PrefixesPageStateActions {
  refreshPrefixes: (workspaceUuid: string) => void;
  createPrefix: (workspaceUuid: string, data: Prefix) => void;
  deletePrefix: (workspaceUuid: string, prefixUuid: string) => void;
}

const defaultState: PrefixesPageState = {
  prefixes: null,
  isLoading: null,
  error: null,
};

const functions: ZustandActions<PrefixesPageStateActions, PrefixesPageState> = (
  set,
  get,
) => ({
  refreshPrefixes(workspaceUuid: string) {
    set({ isLoading: 'Loading prefixes...' });
    PrefixApi.getPrefixesInWorkspace(workspaceUuid)
      .then(prefixes => {
        set({ prefixes, error: null });
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
  createPrefix(workspaceUuid, data) {
    set({ isLoading: 'Creating prefix...' });
    PrefixApi.addPrefixToWorkspace(workspaceUuid, data)
      .then(() => {
        get().refreshPrefixes(workspaceUuid);
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
  deletePrefix(workspaceUuid, prefixUuid) {
    set({ isLoading: 'Deleting prefix...' });
    PrefixApi.removePrefixFromWorkspace(workspaceUuid, prefixUuid)
      .then(() => {
        get().refreshPrefixes(workspaceUuid);
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

const usePrefixesPageState = create<
  PrefixesPageState & PrefixesPageStateActions
>()(
  devtools((set, get) => ({
    ...defaultState,
    ...functions(set, get),
  })),
);

export default usePrefixesPageState;
