import toast from '@/consts/toast';
import useReferencesTreeNode from '@/pages/mapping_page/components/SidePanel/components/SourcePanel/hooks/useReferencesTreeNode';
import useMappingPage from '@/pages/mapping_page/state';
import { H5, Tree, TreeNodeInfo } from '@blueprintjs/core';
import { useCallback, useEffect, useState } from 'react';
const SourcePanel = () => {
  const source = useMappingPage(state => state.source);

  const references: TreeNodeInfo[] = useReferencesTreeNode(source);

  const [referencesState, setReferencesState] =
    useState<TreeNodeInfo[]>(references);

  useEffect(() => {
    setReferencesState(references);
  }, [references]);

  const handleNodeClick = useCallback((node: TreeNodeInfo) => {
    if (node.nodeData) {
      toast.show({
        message: `Reference copied to clipboard: ${node.nodeData as string}`,
        icon: 'clipboard',
        intent: 'success',
      });
      navigator.clipboard.writeText('$(' + (node.nodeData as string) + ')');
    }
  }, []);

  const setNode = useCallback((path: number[], node: TreeNodeInfo) => {
    if (node.childNodes) {
      if (path.length == 1) {
        setReferencesState(state => {
          const newState = [...state];
          newState[path[0]] = node;
          return newState;
        });
        return;
      }
      setReferencesState(state => {
        const newState = [...state];
        let current = newState[path[0]];
        const lastIndex = path.pop()!;
        for (let i = 1; i < path.length; i++) {
          current = current.childNodes![path[i]];
        }
        current.childNodes![lastIndex] = node;
        return newState;
      });
    }
  }, []);

  const handleNodeCollapse = useCallback(
    (node: TreeNodeInfo, path: number[]) => {
      setNode(path, { ...node, isExpanded: false });
    },
    [setNode],
  );

  const handleNodeExpand = useCallback(
    (node: TreeNodeInfo, path: number[]) => {
      setNode(path, { ...node, isExpanded: true });
    },
    [setNode],
  );

  return (
    <>
      <H5>References</H5>
      <Tree
        contents={referencesState}
        onNodeClick={handleNodeClick}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
      />
    </>
  );
};

export default SourcePanel;
