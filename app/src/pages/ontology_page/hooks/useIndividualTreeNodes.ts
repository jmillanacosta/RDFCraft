import { Individual, Ontology } from '@/lib/api/ontology_api/types';
import { createTreeNodeFromLiteral } from '@/pages/ontology_page/utils';
import { TreeNodeInfo } from '@blueprintjs/core';
import { useMemo } from 'react';

const useIndividualTreeNodes = (ontology: Ontology | null) => {
  const nodes = useMemo(() => {
    const getIndividualNodes = (individuals: Individual[]) => {
      return individuals.map(individual => {
        const node = {
          id: individual.full_uri,
          icon: 'cube',
          label:
            individual.label.length > 0
              ? individual.label[0].value
              : individual.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = individual.label.map(createTreeNodeFromLiteral);
        const descriptions = individual.description.map(
          createTreeNodeFromLiteral,
        );
        const isDeprecatedNode = {
          id: `${individual.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${individual.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        node.childNodes = [
          {
            id: `${individual.full_uri}-labels`,
            label: 'Labels',
            icon: 'tag',
            childNodes: labels,
          },
          {
            id: `${individual.full_uri}-descriptions`,
            label: 'Descriptions',
            icon: 'tag',
            childNodes: descriptions,
          },
          isDeprecatedNode,
        ] as TreeNodeInfo[];
        return node;
      });
    };

    return getIndividualNodes(ontology?.individuals ?? []).sort((a, b) =>
      (a.label as string).localeCompare(b.label as string),
    );
  }, [ontology]);

  return nodes;
};

export default useIndividualTreeNodes;
