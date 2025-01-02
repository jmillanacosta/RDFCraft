import { Literal } from '@/lib/api/ontology_api/types';
import { TreeNodeInfo } from '@blueprintjs/core';

export const createTreeNodeFromLiteral = (literal: Literal): TreeNodeInfo => {
  return {
    id: `${literal.language ?? 'none'}-${literal.value}`,
    icon: 'document',
    label: literal.value,
    childNodes: [
      {
        id: `${literal.language ?? 'none'}-${literal.value}-value`,
        icon: 'document',
        label: `Value: ${literal.value}`,
      },
      {
        id: `${literal.language ?? 'none'}-${literal.value}-language`,
        icon: 'document',
        label: `Language: ${literal.language ?? 'none'}`,
      },
    ] as TreeNodeInfo[],
  } as TreeNodeInfo;
};
