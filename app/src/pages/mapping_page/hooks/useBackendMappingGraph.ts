import { MappingGraph } from '@/lib/api/mapping_service/types';
import {
  XYEdgeType,
  XYNodeTypes,
} from '@/pages/mapping_page/components/MainPanel/types';
import { useEffect, useState } from 'react';

export function useBackendMappingGraph(mappingGraph: MappingGraph | null) {
  const [nodes, setNodes] = useState<XYNodeTypes[]>([]);
  const [edges, setEdges] = useState<XYEdgeType[]>([]);

  useEffect(() => {
    if (!mappingGraph) {
      setNodes([]);
      setEdges([]);
    }

    const nodes = mappingGraph?.nodes.map<XYNodeTypes>(node => {
      switch (node.type) {
        case 'entity':
          return {
            id: node.id,
            position: node.position,
            type: 'entity',
            data: node,
          };
        case 'literal':
          return {
            id: node.id,
            position: node.position,
            type: 'literal',
            data: node,
          };
        case 'uri_ref':
          return {
            id: node.id,
            position: node.position,
            type: 'uri_ref',
            data: node,
          };
      }
    });

    const edges = mappingGraph?.edges.map<XYEdgeType>(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.source_handle,
      targetHandle: edge.target_handle,
      data: edge,
    }));

    setNodes(nodes || []);
    setEdges(edges || []);

    return () => {
      setNodes([]);
      setEdges([]);
    };
  }, [mappingGraph]);

  return { nodes, edges };
}
