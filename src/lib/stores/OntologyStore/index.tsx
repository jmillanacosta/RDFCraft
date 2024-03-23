import OntologyService from '@/lib/api/OntologyService';
import WorkspaceService from '@/lib/api/WorkspaceService';
import {
    OntologyClassDocument,
    OntologyIndividualModel,
    OntologyPropertyDocument,
} from '@/lib/models/OntologyIndexModel';
import { OntologyModel } from '@/lib/models/OntologyModel';
import { PrefixModel } from '@/lib/models/PrefixModel';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type OntologyStoreState = {
    loading: boolean;
    error: string | null;
    status_code: number;
    ontologies: { [key: string]: OntologyModel };
    classes: { [key: string]: OntologyClassDocument[] };
    class_domains: { [key: string]: { [key: string]: string[] } }; // Full URI of all classes domains
    class_ranges: { [key: string]: { [key: string]: string[] } }; // Full URI of all classes ranges
    properties: { [key: string]: OntologyPropertyDocument[] };
    individual: { [key: string]: OntologyIndividualModel[] };
    unassigned_prefixes: PrefixModel[];
};

type OntologyStoreActions = {
    fetchOntologyItems: (workspace_id: string, ids: string[]) => void;
    assignPrefix: (
        workspace_id: string,
        ontology_id: string,
        prefix_id: string,
    ) => void;
    clear: () => void;
};

const defaultState: OntologyStoreState = {
    loading: false,
    error: null,
    status_code: 0,
    ontologies: {},
    classes: {},
    properties: {},
    individual: {},
    class_domains: {},
    class_ranges: {},
    unassigned_prefixes: [],
};

const useOntologyStore = create<OntologyStoreState & OntologyStoreActions>()(
    devtools(
        (set, get) => ({
            ...defaultState,
            fetchOntologyItems: async (workspace_id: string, ids: string[]) => {
                set({ loading: true, error: null });
                try {
                    const unassignedPrefixes =
                        await OntologyService.getUnassignedPrefixes(
                            workspace_id,
                        );
                    if (unassignedPrefixes.success) {
                        set({ unassigned_prefixes: unassignedPrefixes.data });
                    } else {
                        set({
                            loading: false,
                            error: `Failed to fetch unassigned prefixes: ${unassignedPrefixes.message}`,
                            status_code: unassignedPrefixes.status,
                        });
                        return;
                    }
                } catch (error) {
                    set({
                        loading: false,
                        error: `Failed to fetch unassigned prefixes: ${error}`,
                        status_code: 500,
                    });
                    return;
                }
                ids.map(async (id) => {
                    try {
                        const [ontology, classes, properties, individuals] =
                            await Promise.all([
                                OntologyService.getOntology(id),
                                OntologyService.getClasses(id),
                                OntologyService.getProperties(id),
                                OntologyService.getIndividuals(id),
                            ]);
                        if (
                            classes.success &&
                            properties.success &&
                            individuals.success &&
                            ontology.success
                        ) {
                            // process classes and properties to get domains and ranges\
                            const class_domains: { [key: string]: string[] } =
                                {};
                            const class_ranges: { [key: string]: string[] } =
                                {};
                            for (const c of classes.data) {
                                class_domains[c.full_uri] = [];
                                class_ranges[c.full_uri] = [];
                            }
                            for (const p of properties.data) {
                                for (const d of p.property_domain) {
                                    if (class_domains[d] === undefined)
                                        continue;
                                    class_domains[d].push(p.full_uri);
                                }
                                for (const r of p.property_range) {
                                    if (class_ranges[r] === undefined) continue;
                                    class_ranges[r].push(p.full_uri);
                                }
                            }
                            set((state) => ({
                                ...state,
                                ontologies: {
                                    ...state.ontologies,
                                    [id]: ontology.data,
                                },
                                classes: {
                                    ...state.classes,
                                    [id]: classes.data,
                                },
                                class_domains: {
                                    ...state.class_domains,
                                    [id]: class_domains,
                                },
                                class_ranges: {
                                    ...state.class_ranges,
                                    [id]: class_ranges,
                                },
                                properties: {
                                    ...state.properties,
                                    [id]: properties.data,
                                },
                                individual: {
                                    ...state.individual,
                                    [id]: individuals.data,
                                },
                            }));
                        } else {
                            const error = [
                                classes.message,
                                properties.message,
                                individuals.message,
                            ].join(' ');
                            const status_code = Math.max(
                                classes.status,
                                properties.status,
                                individuals.status,
                            );
                            set({
                                loading: false,
                                error: `Failed to fetch ontology items: ${error}`,
                                status_code: status_code,
                            });
                            return;
                        }

                        set({ loading: false });
                    } catch (error) {
                        set({
                            loading: false,
                            error: `Failed to fetch ontology items: ${error}`,
                            status_code: 500,
                        });
                        return;
                    }
                });
            },
            assignPrefix: async (
                workspace_id: string,
                ontology_id: string,
                prefix_id: string,
            ) => {
                set({ loading: true, error: null });
                try {
                    const response =
                        await WorkspaceService.assignPrefixToOntology(
                            workspace_id,
                            ontology_id,
                            prefix_id,
                        );
                    if (response.success) {
                        get().fetchOntologyItems(workspace_id, [ontology_id]);
                        return;
                    } else {
                        set({
                            loading: false,
                            error: `Failed to assign prefix: ${response.message}`,
                            status_code: response.status,
                        });
                        return;
                    }
                } catch (error) {
                    set({
                        loading: false,
                        error: `Failed to assign prefix: ${error}`,
                        status_code: 500,
                    });
                    return;
                }
            },
            clear: () => {
                set(defaultState);
            },
        }),
        {
            name: 'OntologyStore',
        },
    ),
);

export default useOntologyStore;
