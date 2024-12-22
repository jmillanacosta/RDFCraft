import { Property } from '@/lib/api/ontology_api/types';
import {
  EntityNodeType,
  XYNodeTypes,
} from '@/pages/mapping_page/components/MainPanel/types';
import useMappingPage from '@/pages/mapping_page/state';
import { useNodes } from '@xyflow/react';
import { useEffect, useState } from 'react';

export default function useRangeOrderer(node: EntityNodeType) {
  const [predicates, setPredicates] = useState<
    (Property & { group: string })[]
  >([]);
  const ontologies = useMappingPage(state => state.ontologies);
  const nodes = useNodes<XYNodeTypes>();

  useEffect(() => {


  }, [node, nodes, ontologies]);

  return predicates;
}
