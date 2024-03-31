import {
  LiteralNodeDataModel,
  ObjectNodeDataModel,
} from '@/lib/models/MappingModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { useEffect, useState } from 'react';
import { Node } from 'reactflow';

export default function useNodeSearch(search: string) {
  const nodes = useMappingStore(state => state.nodes);
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number | null>(null);

  useEffect(() => {
    const searchNodes = () => {
      if (search === '') {
        setSearchResults([]);
        return;
      }
      const results = nodes.filter(node => {
        const byLabel = (node as Node<ObjectNodeDataModel>).data.label
          .toLowerCase()
          .includes(search.toLowerCase());
        if (node.type === 'literal') {
          return (
            byLabel ||
            (node.data as LiteralNodeDataModel).rdf_type
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (node.data as LiteralNodeDataModel).pattern
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        }
        return (
          byLabel ||
          (node.data as ObjectNodeDataModel).rdf_type
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (node.data as ObjectNodeDataModel).pattern
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      });
      setSearchResults(results);
      setCurrentNodeIndex(null);
    };

    searchNodes();
  }, [search, nodes]);

  const nextNode = () => {
    if (currentNodeIndex === null) {
      setCurrentNodeIndex(0);
    } else if (currentNodeIndex + 1 < searchResults.length) {
      setCurrentNodeIndex(currentNodeIndex + 1);
    }
  };

  const previousNode = () => {
    if (currentNodeIndex === null) {
      return;
    } else if (currentNodeIndex - 1 >= 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
    }
  };

  const nextButtonDisabled = () => {
    return (
      searchResults.length === 0 ||
      (currentNodeIndex ?? -1) + 1 === searchResults.length
    );
  };

  const previousButtonDisabled = () => {
    return (
      currentNodeIndex === null ||
      searchResults.length === 0 ||
      currentNodeIndex === 0
    );
  };

  return {
    searchResults,
    nextNode,
    previousNode,
    nextButtonDisabled,
    previousButtonDisabled,
    currentNodeIndex,
  };
}
