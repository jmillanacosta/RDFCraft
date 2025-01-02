import { XYNodeTypes } from '@/pages/mapping_page/components/MainPanel/types';
import useMappingPage from '@/pages/mapping_page/state';
import {
  Card,
  CardList,
  FormGroup,
  Icon,
  InputGroup,
  NonIdealState,
} from '@blueprintjs/core';
import { useNodes, useReactFlow, useStoreApi } from '@xyflow/react';
import { useCallback, useMemo, useState } from 'react';

const SearchPanel = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchBounceBack, setSearchBounceBack] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const nodes = useNodes<XYNodeTypes>();
  const store = useStoreApi();
  const { setNodes } = store.getState();
  const reactflow = useReactFlow();
  const setSelectedTab = useMappingPage(state => state.setSelectedTab);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchBounceBack) {
      clearTimeout(searchBounceBack);
    }
    const timeout = setTimeout(() => {
      setSearchValue(e.target.value);
    }, 300);

    setSearchBounceBack(timeout);
  };

  const searchResults = useMemo<XYNodeTypes[] | null>(() => {
    if (!searchValue) {
      return null;
    }

    return nodes.filter(node => {
      switch (node.type) {
        case 'literal':
        case 'entity':
          return node.data.label
            .toLowerCase()
            .includes(searchValue.toLowerCase());

        case 'uri_ref':
          return node.data.uri_pattern
            .toLowerCase()
            .includes(searchValue.toLowerCase());
      }
    });
  }, [nodes, searchValue]);

  const getLabelFromNode = useCallback((node: XYNodeTypes) => {
    switch (node.type) {
      case 'entity':
      case 'literal':
        return node.data.label;
      case 'uri_ref':
        return node.data.uri_pattern;
    }
  }, []);

  const handleNodeFocus = useCallback(
    (node: XYNodeTypes) => {
      reactflow?.setCenter(node.position.x, node.position.y, {
        zoom: 1.5,
        duration: 1000,
      });
      setNodes(
        nodes.map(n => {
          if (n.id === node.id) {
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
    },
    [reactflow, setNodes, nodes],
  );

  const handleNodeEdit = useCallback(
    (node: XYNodeTypes) => {
      reactflow?.setCenter(node.position.x, node.position.y, {
        zoom: 1.5,
        duration: 1000,
      });
      setNodes(
        nodes.map(n => {
          if (n.id === node.id) {
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
    [reactflow, nodes, setNodes, setSelectedTab],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <FormGroup
        label='Search'
        style={{
          flex: '0 0 auto',
        }}
      >
        <InputGroup
          placeholder='Search nodes'
          type='search'
          onChange={handleSearch}
        />
      </FormGroup>
      <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
        {searchResults === null && (
          <NonIdealState
            icon='search'
            title='Search for nodes'
            description='Start typing to search for nodes'
          />
        )}
        {searchResults && searchResults.length === 0 && (
          <NonIdealState
            icon='search'
            title='No results found'
            description='Try searching for something else'
          />
        )}
        {searchResults && searchResults.length !== 0 && (
          <CardList
            style={{
              height: 'auto',
            }}
          >
            {searchResults?.map(node => (
              <Card
                key={node.id}
                interactive
                onClick={() => handleNodeFocus(node)}
                style={{ display: 'flex', justifyContent: 'space-between' }}
                title={`Focus on ${getLabelFromNode(node)}`}
              >
                {getLabelFromNode(node)}
                <Icon
                  icon='edit'
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleNodeEdit(node);
                  }}
                  title={`Edit ${getLabelFromNode(node)}`}
                />
              </Card>
            ))}
          </CardList>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
