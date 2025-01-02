import { Ontology, OntologyClass } from '@/lib/api/ontology_api/types';
import { createTreeNodeFromLiteral } from '@/pages/ontology_page/utils';
import { TreeNodeInfo } from '@blueprintjs/core';
import { useMemo } from 'react';

const usePropertyTreeNodes = (ontology: Ontology | null) => {
  const nodes = useMemo(() => {
    const getDomainClasses = (classes: string[]) => {
      return classes.map(domainClassUri => {
        const domainClass = ontology?.classes.find(
          c => c.full_uri === domainClassUri,
        ) as OntologyClass;
        if (!domainClass) {
          return {
            id: domainClassUri,
            icon: 'cube',
            label: domainClassUri,
            childNodes: [],
          } as TreeNodeInfo;
        }
        const node = {
          id: domainClass.full_uri,
          icon: 'cube',
          label:
            domainClass.label.length > 0
              ? domainClass.label[0].value
              : domainClass.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = domainClass.label.map(createTreeNodeFromLiteral);
        const descriptions = domainClass.description.map(
          createTreeNodeFromLiteral,
        );
        const isDeprecatedNode = {
          id: `${domainClass.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${domainClass.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        return {
          ...node,
          childNodes: [
            {
              id: `${domainClass.full_uri}-labels`,
              label: 'Labels',
              icon: 'tag',
              childNodes: labels,
            },
            {
              id: `${domainClass.full_uri}-descriptions`,
              label: 'Descriptions',
              icon: 'tag',
              childNodes: descriptions,
            },
            isDeprecatedNode,
          ] as TreeNodeInfo[],
        };
      });
    };

    const getRangeClasses = (classes: string[]) => {
      return classes.map(rangeClassUri => {
        const rangeClass = ontology?.classes.find(
          c => c.full_uri === rangeClassUri,
        ) as OntologyClass;
        if (!rangeClass) {
          return {
            id: rangeClassUri,
            icon: 'cube',
            label: rangeClassUri,
            childNodes: [],
          } as TreeNodeInfo;
        }
        const node = {
          id: rangeClass.full_uri,
          icon: 'cube',
          label:
            rangeClass.label.length > 0
              ? rangeClass.label[0].value
              : rangeClass.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = rangeClass.label.map(createTreeNodeFromLiteral);
        const descriptions = rangeClass.description.map(
          createTreeNodeFromLiteral,
        );
        const isDeprecatedNode = {
          id: `${rangeClass.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${rangeClass.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        return {
          ...node,
          childNodes: [
            {
              id: `${rangeClass.full_uri}-labels`,
              label: 'Labels',
              icon: 'tag',
              childNodes: labels,
            },
            {
              id: `${rangeClass.full_uri}-descriptions`,
              label: 'Descriptions',
              icon: 'tag',
              childNodes: descriptions,
            },
            isDeprecatedNode,
          ] as TreeNodeInfo[],
        };
      });
    };
    return (
      ontology?.properties.map(property => {
        const node = {
          id: property.full_uri,
          icon: 'cube',
          label:
            property.label.length > 0
              ? property.label[0].value
              : property.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = property.label.map(createTreeNodeFromLiteral);
        const descriptions = property.description.map(
          createTreeNodeFromLiteral,
        );
        const isDeprecatedNode = {
          id: `${property.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${property.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        return {
          ...node,
          childNodes: [
            {
              id: `${property.full_uri}-labels`,
              label: 'Labels',
              icon: 'tag',
              childNodes: labels,
            },
            {
              id: `${property.full_uri}-descriptions`,
              label: 'Descriptions',
              icon: 'tag',
              childNodes: descriptions,
            },
            {
              id: `${property.full_uri}-domain`,
              label: 'Domain Classes',
              icon: 'cubes',
              childNodes: getDomainClasses(property.domain),
            },
            {
              id: `${property.full_uri}-range`,
              label: 'Range Classes',
              icon: 'cubes',
              childNodes: getRangeClasses(property.range),
            },
            isDeprecatedNode,
          ] as TreeNodeInfo[],
        };
      }) ?? []
    ).sort((a, b) => (a.label as string).localeCompare(b.label as string));
  }, [ontology]);

  return nodes;
};

export default usePropertyTreeNodes;
