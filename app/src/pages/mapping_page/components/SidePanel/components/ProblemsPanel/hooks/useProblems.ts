import {
  XYEdgeType,
  XYNodeTypes,
} from '@/pages/mapping_page/components/MainPanel/types';
import { useMemo } from 'react';

interface Problem {
  nodeId: string;
  messages: {
    level: 'error' | 'warning';
    message: string;
  }[];
}

const noURIDefinedCheck = (nodes: XYNodeTypes[]): Problem[] => {
  return nodes
    .map<Problem | undefined>(node => {
      if (
        (node.type === 'entity' || node.type === 'uri_ref') &&
        (!node.data.uri_pattern || node.data.uri_pattern === '')
      ) {
        return {
          nodeId: node.id,
          messages: [{ level: 'error', message: 'URI is not defined' }],
        };
      }
    })
    .filter((e): e is Problem => e !== undefined);
};

const noValueDefinedCheck = (nodes: XYNodeTypes[]): Problem[] => {
  return nodes
    .map<Problem | undefined>(node => {
      if (
        node.type === 'literal' &&
        (!node.data.value || node.data.value === '')
      ) {
        return {
          nodeId: node.id,
          messages: [{ level: 'error', message: 'Value is not defined' }],
        };
      }
    })
    .filter(e => e !== undefined);
};

const noTypeDefinedCheck = (nodes: XYNodeTypes[]): Problem[] => {
  return nodes
    .map<Problem | undefined>(node => {
      if (node.type === 'literal' && node.data.literal_type === '') {
        return {
          nodeId: node.id,
          messages: [
            { level: 'warning', message: 'Literal type is not defined' },
          ],
        };
      }
    })
    .filter(e => e !== undefined);
};

const orphanLiteralUriRefCheck = (
  nodes: XYNodeTypes[],
  edges: XYEdgeType[],
): Problem[] => {
  const literalUriRefIds = nodes
    .filter(node => node.type === 'literal' || node.type === 'uri_ref')
    .map(node => node.id);

  const connectedIds = edges
    .map(edge => edge.source)
    .concat(edges.map(edge => edge.target));

  return literalUriRefIds
    .filter(id => !connectedIds.includes(id))
    .map(id => ({
      nodeId: id,
      messages: [
        { level: 'warning', message: 'Literal or URI Ref is not connected' },
      ],
    }));
};

const useProblems = (nodes: XYNodeTypes[], edges: XYEdgeType[]): Problem[] => {
  return useMemo(() => {
    const problems: Problem[] = [];

    problems.push(...noURIDefinedCheck(nodes));
    problems.push(...noValueDefinedCheck(nodes));
    problems.push(...noTypeDefinedCheck(nodes));
    problems.push(...orphanLiteralUriRefCheck(nodes, edges));

    const mergedProblems: Problem[] = [];

    problems.forEach(problem => {
      const existingProblem = mergedProblems.find(
        p => p.nodeId === problem.nodeId,
      );

      if (existingProblem) {
        existingProblem.messages.push(...problem.messages);
      } else {
        mergedProblems.push(problem);
      }
    });

    return mergedProblems;
  }, [nodes, edges]);
};

export default useProblems;
