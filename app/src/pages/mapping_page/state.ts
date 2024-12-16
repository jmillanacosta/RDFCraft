import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import MappingService from '../../lib/api/mapping_service';
import { MappingGraph } from '../../lib/api/mapping_service/types';
import OntologyApi from '../../lib/api/ontology_api';
import { Ontology } from '../../lib/api/ontology_api/types';
import PrefixApi from '../../lib/api/prefix_api';
import { Prefix } from '../../lib/api/prefix_api/types';
import { ZustandActions } from '../../utils/zustand';

interface MappingPageState {
  mapping: MappingGraph | null;
  ontologies: Ontology[] | null;
  prefixes: Prefix[] | null;
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
  ontologies: null,
  prefixes: null,
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
      const mapping_promise = MappingService.getMappingInWorkspace(
        workspaceUuid,
        mappingUuid,
      );
      const ontologies_promise =
        OntologyApi.getOntologiesInWorkspace(workspaceUuid);
      const prefixes_promise = PrefixApi.getPrefixesInWorkspace(workspaceUuid);

      const [mapping, ontologies, prefixes] = await Promise.all([
        mapping_promise,
        ontologies_promise,
        prefixes_promise,
      ]);

      set({ mapping, ontologies, prefixes, error: null });
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
