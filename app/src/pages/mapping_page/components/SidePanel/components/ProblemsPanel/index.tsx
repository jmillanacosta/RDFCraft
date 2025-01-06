import {
  XYEdgeType,
  XYNodeTypes,
} from '@/pages/mapping_page/components/MainPanel/types';
import useProblems from '@/pages/mapping_page/components/SidePanel/components/ProblemsPanel/hooks/useProblems';
import useMappingPage from '@/pages/mapping_page/state';
import { Card, CardList, H5, NonIdealState } from '@blueprintjs/core';
import { useEdges, useNodes, useReactFlow, useStoreApi } from '@xyflow/react';
import { useCallback } from 'react';
const ProblemsPanel = () => {
  const nodes = useNodes<XYNodeTypes>();
  const edges = useEdges<XYEdgeType>();
  const reactflow = useReactFlow();
  const store = useStoreApi();
  const { setNodes } = store.getState();
  const setSelectedTab = useMappingPage(state => state.setSelectedTab);

  const problems = useProblems(nodes, edges);

  const handleNodeFocus = useCallback(
    (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) {
        return;
      }
      reactflow?.setCenter(node.position.x, node.position.y, {
        zoom: 1.5,
        duration: 1000,
      });

      setNodes(
        nodes.map(n => {
          if (n.id === nodeId) {
            return {
              ...n,
              selected: true,
            };
          }
          return {
            ...n,
            selected: false,
          };
        }),
      );

      setSelectedTab('properties');
    },
    [reactflow, setNodes, nodes, setSelectedTab],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <H5>Problems</H5>
      <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
        {problems.length === 0 ? (
          <NonIdealState
            icon='tick-circle'
            title='No problems'
            description='Everything is fine'
          />
        ) : (
          <CardList style={{ height: 'auto' }}>
            {problems.map(problem => (
              <Card
                key={problem.nodeId}
                interactive
                onClick={() => handleNodeFocus(problem.nodeId)}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
                title={problem.nodeId}
              >
                Problems with node {problem.nodeId}
                <ul>
                  {problem.messages.map(message => (
                    <li
                      style={{
                        listStyleType: 'disc',
                      }}
                      key={`${problem.nodeId}-${message.message}`}
                    >
                      {message.message} (
                      {message.level === 'warning' ? 'Warning' : 'Error'})
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </CardList>
        )}
      </div>
    </div>
  );
};

export default ProblemsPanel;
