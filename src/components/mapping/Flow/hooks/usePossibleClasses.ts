'use client';

import { OntologyClassDocument } from '@/lib/models/OntologyIndexModel';
import useMappingStore from '@/lib/stores/MappingStore';
import useOntologyStore from '@/lib/stores/OntologyStore';
import { useEffect, useState } from 'react';

export default function usePossibleClasses(nodeId: string) {
    const [possibleClasses, setPossibleClasses] = useState<
        OntologyClassDocument[]
    >([]);

    const edges = useMappingStore((state) => state.edges);
    const nodes = useMappingStore((state) => state.nodes);
    const ontClasses = useOntologyStore((state) => state.classes);
    const ontPredicates = useOntologyStore((state) => state.properties);

    useEffect(() => {
        const getPossibleClasses = () => {
            // Make classes dict to list
            const classesList = Object.values(ontClasses).reduce(
                (acc, val) => acc.concat(val),
                [],
            );
            const predicatesList = Object.values(ontPredicates).reduce(
                (acc, val) => acc.concat(val),
                [],
            );
            const outgoings = edges.filter((edge) => edge.source === nodeId);
            const incomings = edges.filter((edge) => edge.target === nodeId);

            const incomingConstraints: string[] = [];
            incomings.forEach((edge) => {
                const predicate = predicatesList.find(
                    (predicate) => predicate.full_uri === edge.data?.full_uri,
                );
                if (predicate) {
                    incomingConstraints.push(...predicate.property_range);
                }
            });
            const outgoingConstraints: string[] = [];
            outgoings.forEach((edge) => {
                const predicate = predicatesList.find(
                    (predicate) => predicate.full_uri === edge.data?.full_uri,
                );
                if (predicate) {
                    outgoingConstraints.push(...predicate.property_domain);
                }
            });

            const classes = classesList.filter((cls) => {
                if (incomingConstraints.length > 0) {
                    return incomingConstraints.includes(cls.full_uri);
                }
                if (outgoingConstraints.length > 0) {
                    return outgoingConstraints.includes(cls.full_uri);
                }
                return true;
            });

            setPossibleClasses(classes);
        };

        getPossibleClasses();
        return () => {
            setPossibleClasses([]);
        };
    }, [edges, nodes, ontClasses, ontPredicates, nodeId]);
    return possibleClasses;
}
