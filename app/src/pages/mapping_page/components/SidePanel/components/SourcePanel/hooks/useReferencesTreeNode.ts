import { Source } from '@/lib/api/source_api/types';
import { TreeNodeInfo } from '@blueprintjs/core';
import { useMemo } from 'react';

const useReferencesTreeNode = (source: Source | null) => {
  const nodes = useMemo(() => {
    const root = {
      id: 'root',
      label: 'root',
      icon: 'cube',
      isExpanded: true,
      childNodes: [],
    } as TreeNodeInfo;
    if (!source) return [];
    if (source.type === 'csv') {
      root.childNodes = source.references.map(ref => ({
        id: ref,
        label: ref,
        icon: 'document',
        data: ref,
      }));
    }
    if (source.type === 'json') {
      source.references.forEach(ref => {
        const parts = ref.split('.');
        let currentObj: TreeNodeInfo = root;
        let currentPath = 'root';
        parts.forEach((part, index) => {
          if (currentObj.childNodes === undefined) {
            currentObj.childNodes = [];
          }
          currentPath += '.' + part;
          const existingNode = findExistingNode(currentObj, currentPath);
          if (existingNode) {
            currentObj = existingNode;
          } else {
            const newNode: TreeNodeInfo = {
              id: currentPath,
              label: part.replace('[*]', ''),
              icon: currentPath.includes('[*]') ? 'array' : 'cube',
              isExpanded: index === parts.length - 1,
            };
            currentObj.childNodes.push(newNode);
            currentObj = newNode;
          }
        });
        currentObj.icon = 'document';
        currentObj.nodeData = ref;
      });
    }
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        node.childNodes?.sort((a, b) => {
          if (a.childNodes && !b.childNodes) {
            return 1;
          }
          if (!a.childNodes && b.childNodes) {
            return -1;
          }
          return (a.label as string).localeCompare(b.label as string);
        });
        queue.push(...(node.childNodes ?? []));
      }
    }
    return [root];
  }, [source]);

  return nodes;
};

const findExistingNode = (currentObj: TreeNodeInfo, currentPath: string) => {
  return currentObj.childNodes?.find(node => node.id === currentPath);
};

export default useReferencesTreeNode;
