import { Ontology, Property } from '@/lib/api/ontology_api/types';
import { createTreeNodeFromLiteral } from '@/pages/ontology_page/utils';
import { TreeNodeInfo } from '@blueprintjs/core';
import { useMemo } from 'react';

const useClassTreeNodes = (ontology: Ontology | null) => {
  const nodes = useMemo(() => {
    const getDomainNodes = (domains: Property[]) => {
      return domains.map(domain => {
        const node = {
          id: domain.full_uri,
          icon: 'cube',
          label:
            domain.label.length > 0 ? domain.label[0].value : domain.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = domain.label.map(createTreeNodeFromLiteral);
        const descriptions = domain.description.map(createTreeNodeFromLiteral);
        const isDeprecatedNode = {
          id: `${domain.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${domain.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        node.childNodes = [
          {
            id: `${domain.full_uri}-labels`,
            label: 'Labels',
            icon: 'tag',
            childNodes: labels,
          },
          {
            id: `${domain.full_uri}-descriptions`,
            label: 'Descriptions',
            icon: 'tag',
            childNodes: descriptions,
          },
          isDeprecatedNode,
        ] as TreeNodeInfo[];
        return node;
      });
    };

    const getRangeNodes = (ranges: Property[]) => {
      return ranges.map(range => {
        const node = {
          id: range.full_uri,
          icon: 'cube',
          label: range.label.length > 0 ? range.label[0].value : range.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = range.label.map(createTreeNodeFromLiteral);
        const descriptions = range.description.map(createTreeNodeFromLiteral);
        const isDeprecatedNode = {
          id: `${range.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${range.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        node.childNodes = [
          {
            id: `${range.full_uri}-labels`,
            label: 'Labels',
            icon: 'tag',
            childNodes: labels,
          },
          {
            id: `${range.full_uri}-descriptions`,
            label: 'Descriptions',
            icon: 'tag',
            childNodes: descriptions,
          },
          isDeprecatedNode,
        ] as TreeNodeInfo[];
        return node;
      });
    };

    return (
      ontology?.classes.map(ontologyClass => {
        const node = {
          id: ontologyClass.full_uri,
          icon: 'cube',
          label:
            ontologyClass.label.length > 0
              ? ontologyClass.label[0].value
              : ontologyClass.full_uri,
          childNodes: [],
        } as TreeNodeInfo;

        const labels = ontologyClass.label.map(createTreeNodeFromLiteral);
        const descriptions = ontologyClass.description.map(
          createTreeNodeFromLiteral,
        );
        const isDeprecatedNode = {
          id: `${ontologyClass.full_uri}-is-deprecated`,
          label: `Is Deprecated: ${ontologyClass.is_deprecated ?? false}`,
        } as TreeNodeInfo;

        const uri_with_superclasses = [
          ontologyClass.full_uri,
          ...ontologyClass.super_classes,
        ];

        const domains = ontology?.properties.filter(property =>
          property.domain.some(domain =>
            uri_with_superclasses.includes(domain),
          ),
        );

        const ranges = ontology?.properties.filter(property =>
          property.range.some(range => uri_with_superclasses.includes(range)),
        );

        const domainNodes = getDomainNodes(domains);
        const rangeNodes = getRangeNodes(ranges);

        node.childNodes = [
          {
            id: `${ontologyClass.full_uri}-labels`,
            label: 'Labels',
            icon: 'tag',
            childNodes: labels,
          },
          {
            id: `${ontologyClass.full_uri}-descriptions`,
            label: 'Descriptions',
            icon: 'tag',
            childNodes: descriptions,
          },
          {
            id: `${ontologyClass.full_uri}-domains`,
            label: 'Domain Properties',
            icon: 'arrows-horizontal',
            childNodes: domainNodes,
          },
          {
            id: `${ontologyClass.full_uri}-ranges`,
            label: 'Range Properties',
            icon: 'arrows-horizontal',
            childNodes: rangeNodes,
          },
          isDeprecatedNode,
        ] as TreeNodeInfo[];
        return node;
      }) ?? []
    ).sort((a, b) => {
      return (a.label as string).localeCompare(b.label as string);
    });
  }, [ontology?.classes, ontology?.properties]);

  return nodes;
};

export default useClassTreeNodes;
