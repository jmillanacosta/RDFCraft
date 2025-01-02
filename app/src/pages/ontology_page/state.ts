import OntologyApi from '@/lib/api/ontology_api';
import { Ontology } from '@/lib/api/ontology_api/types';
import { ZustandActions } from '@/utils/zustand';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OntologyPageState {
  ontology: Ontology | null;
  isLoading: string | null; // If the value is null, it means that the data is not being loaded, otherwise it will contain the loading message
  error: string | null;
}

interface OntologyPageStateActions {
  getOntology: (uuid: string, ontology_uuid: string) => void;
}

const defaultState: OntologyPageState = {
  ontology: null,
  isLoading: null,
  error: null,
};

const functions: ZustandActions<
  OntologyPageStateActions,
  OntologyPageState
> = set => ({
  getOntology(uuid: string, ontology_uuid: string) {
    set({ isLoading: 'Loading ontology...' });
    OntologyApi.getOntologiesInWorkspace(uuid)
      .then(ontologies => {
        const ontology = ontologies.find(
          ontology => ontology.uuid === ontology_uuid,
        );
        if (ontology) {
          set({ ontology, error: null });
        } else {
          set({ error: 'Ontology not found' });
        }
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

const useOntologyPage = create<OntologyPageState & OntologyPageStateActions>()(
  devtools((set, get) => ({
    ...defaultState,
    ...functions(set, get),
  })),
);

export default useOntologyPage;
