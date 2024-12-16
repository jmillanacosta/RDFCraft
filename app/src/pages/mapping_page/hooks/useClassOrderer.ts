import { getConnectedEdges, useEdges } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { OntologyClass } from '../../../lib/api/ontology_api/types';
import { EntityNodeType, XYEdgeType } from '../components/MainPanel/types';
import useMappingPage from '../state';

/**
 * Custom hook to order ontology classes based on the properties of a given node.
 *
 * @param node - The entity node for which the classes are to be ordered.
 * @returns An object containing the ordered classes.
 *
 * The hook performs the following steps:
 * 1. Initializes state for storing classes.
 * 2. Retrieves edges and ontologies from the mapping page state.
 * 3. Uses a `useEffect` hook to update the classes whenever the edges, ontologies, or node change.
 * 4. If there are no ontologies, it resets the classes state.
 * 5. Flattens all classes and properties from the ontologies.
 * 6. Retrieves outgoing properties from the node and incoming properties from connected edges.
 * 7. If there are no outgoing or incoming properties, it sets the classes state to include all classes grouped by ontology.
 * 8. Filters classes based on whether they apply to the outgoing and incoming properties.
 * 9. Identifies the best fit classes that apply to both outgoing and incoming properties.
 * 10. Groups the remaining classes by their respective ontologies.
 * 11. Updates the classes state with the ordered classes.
 */
export default function useClassOrderer(node: EntityNodeType) {
  const [classes, setClasses] = useState<(OntologyClass & { group: string })[]>(
    [],
  );
  const edges = useEdges<XYEdgeType>();
  const ontologies = useMappingPage(state => state.ontologies);

  useEffect(() => {
    if (!ontologies || ontologies.length === 0) {
      setClasses([]);
      return;
    }

    const allClasses = ontologies.flatMap(ontology => ontology.classes);
    const allProperties = ontologies.flatMap(ontology => ontology.properties);

    const outgoingProperties = node.data.properties;
    const incomingProperties = getConnectedEdges([node], edges)
      .filter(edge => edge.target === node.id)
      .map(edge => allProperties.find(p => p.full_uri === edge.sourceHandle))
      .filter((p): p is (typeof allProperties)[number] => p !== undefined);

    if (outgoingProperties.length === 0 && incomingProperties.length === 0) {
      const classesArr = ontologies.reduce(
        (acc, ontology) => {
          acc.push(
            ...ontology.classes.map(c => ({ ...c, group: ontology.name })),
          );
          return acc;
        },
        [] as (OntologyClass & { group: string })[],
      );
      setClasses(classesArr);
      return;
    }

    const classesArr = [] as (OntologyClass & { group: string })[];

    const filterClasses = (
      properties: typeof allProperties,
      key: 'domain' | 'range',
    ) =>
      allClasses.filter(c =>
        properties.every(p =>
          p[key].some(d => [c.full_uri, ...c.super_classes].includes(d)),
        ),
      );

    const classesApplyToOutgoing = filterClasses(outgoingProperties, 'domain');
    const classesApplyToIncoming = filterClasses(incomingProperties, 'range');

    const bestFitClasses = classesApplyToOutgoing.filter(c =>
      classesApplyToIncoming.includes(c),
    );
    classesArr.push(...bestFitClasses.map(c => ({ ...c, group: 'Best Fit' })));

    allClasses.forEach(c => {
      if (!bestFitClasses.includes(c)) {
        const ontology = ontologies.find(o =>
          o.classes.some(oc => oc.full_uri === c.full_uri),
        );
        if (ontology) {
          classesArr.push({ ...c, group: ontology.name });
        }
      }
    });

    setClasses(classesArr);
  }, [edges, ontologies, node]);

  return { classes };
}
