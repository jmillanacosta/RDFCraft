'use client';

type OntologyIndividualModel = {
    _id: string;
    full_uri: string;
    ontology__id: string;
    label: string;
    description: string;
    is_deprecated: boolean;
};

type PropertyType = 'object_property' | 'data_property';

type OntologyPropertyDocument = {
    _id: string;
    full_uri: string;
    ontology__id: string;
    label: string;
    description: string;
    is_deprecated: boolean;
    property_type: PropertyType;
    property_range: string[];
    property_domain: string[];
};

type OntologyClassDocument = {
    _id: string;
    full_uri: string;
    ontology_id: string;
    label: string;
    description: string;
    is_deprecated: boolean;
};

export type {
    OntologyClassDocument,
    OntologyIndividualModel,
    OntologyPropertyDocument,
};
