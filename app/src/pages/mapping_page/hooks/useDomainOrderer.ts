import { Property } from '@/lib/api/ontology_api/types';
import { EntityNodeType } from '@/pages/mapping_page/components/MainPanel/types';
import useMappingPage from '@/pages/mapping_page/state';
import { useEffect, useState } from 'react';

export default function useDomainOrderer(node: EntityNodeType) {
  const [predicates, setPredicates] = useState<
    (Property & { group: string })[]
  >([]);
  const ontologies = useMappingPage(state => state.ontologies);

  useEffect(() => {
    if (!ontologies || ontologies.length === 0) {
      setPredicates([]);
      return;
    }

    const allClasses = ontologies.flatMap(ontology => ontology.classes);
    const nodeClasses = node.data.rdf_type.map(uri =>
      allClasses.find(c => c.full_uri === uri),
    );
    const allNodeClassUris = nodeClasses
      .flatMap(c => [c?.full_uri, ...(c?.super_classes ?? [])])
      .filter((uri): uri is string => uri !== undefined);

    const allProperties = ontologies.flatMap(ontology => ontology.properties);

    const bestFitProperties = allNodeClassUris.map(uri =>
      allProperties.filter(p => p.domain.includes(uri)),
    );

    const propertiesArr: (Property & { group: string })[] = [];

    bestFitProperties.forEach(properties =>
      propertiesArr.push(...properties.map(p => ({ ...p, group: 'Best Fit' }))),
    );

    allProperties.forEach(p => {
      if (!propertiesArr.some(prop => prop.full_uri === p.full_uri)) {
        propertiesArr.push({
          ...p,
          group:
            ontologies.find(o => o.base_uri === p.belongs_to)?.name ?? 'Other',
        });
      }
    });

    setPredicates(propertiesArr);

    return () => {
      setPredicates([]);
    };
  }, [node, ontologies]);

  return predicates;
}
