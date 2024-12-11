import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import OntologyApi from '../../lib/api/ontology_api';
import { Ontology } from '../../lib/api/ontology_api/types';
import { ZustandActions } from '../../utils/zustand';

interface OntologiesPageState {
  ontologies: Ontology[] | null;
  isLoading: string | null; // If the value is null, it means that the data is not being loaded, otherwise it will contain the loading message
  error: string | null;
}

interface OntologiesPageStateActions {
  refreshOntologies: (workspaceUuid: string) => void;
  createOntology: (
    workspaceUuid: string,
    data: {
      name: string;
      description: string;
      baseUri: string;
      file: File;
    },
  ) => void;
  deleteOntology: (workspaceUuid: string, ontologyUuid: string) => void;
}

const defaultState: OntologiesPageState = {
  ontologies: null,
  isLoading: null,
  error: null,
};

const functions: ZustandActions<
  OntologiesPageStateActions,
  OntologiesPageState
> = (set, get) => ({
  refreshOntologies(workspaceUuid: string) {
    set({ isLoading: 'Loading ontologies...' });
    OntologyApi.getOntologiesInWorkspace(workspaceUuid)
      .then(ontologies => {
        set({ ontologies, error: null });
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
  createOntology(workspaceUuid, data) {
    set({ isLoading: 'Creating ontology...' });
    OntologyApi.createOntologyInWorkspace(
      workspaceUuid,
      data.name,
      data.description,
      data.baseUri,
      data.file,
    )
      .then(() => {
        get().refreshOntologies(workspaceUuid);
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
  deleteOntology(workspaceUuid, ontologyUuid) {
    set({ isLoading: 'Deleting ontology...' });
    OntologyApi.deleteOntologyInWorkspace(workspaceUuid, ontologyUuid)
      .then(() => {
        get().refreshOntologies(workspaceUuid);
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

const useOntologiesPageState = create<
  OntologiesPageState & OntologiesPageStateActions
>()(
  devtools((set, get) => ({
    ...defaultState,
    ...functions(set, get),
  })),
);

export default useOntologiesPageState;
