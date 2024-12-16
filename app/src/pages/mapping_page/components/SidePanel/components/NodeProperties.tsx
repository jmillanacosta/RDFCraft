import {
  FormGroup,
  InputGroup,
  MenuItem,
  NonIdealState,
} from '@blueprintjs/core';
import { ItemListRendererProps, MultiSelect } from '@blueprintjs/select';
import { useNodes, useReactFlow } from '@xyflow/react';
import { useEffect, useMemo, useState } from 'react';
import GroupedSelectRenderer from '../../../../../components/GroupedSelectRenderer';
import toast from '../../../../../consts/toast';
import { OntologyClass } from '../../../../../lib/api/ontology_api/types';
import useClassOrderer from '../../../hooks/useClassOrderer';
import useMappingPage from '../../../state';
import { EntityNodeType, XYNodeTypes } from '../../MainPanel/types';

const NodeProperties = () => {
  const nodes = useNodes<XYNodeTypes>();

  const selectedNodes = useMemo(() => {
    return nodes.filter(node => node.selected);
  }, [nodes]);

  const [selectedNode, setSelectedNode] = useState<XYNodeTypes | null>(null);

  useEffect(() => {
    if (selectedNodes.length === 1) {
      setSelectedNode(selectedNodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodes]);

  if (!selectedNode) {
    return (
      <NonIdealState
        icon='graph'
        title='Select a node'
        description='Select a node to view and edit its properties.'
      />
    );
  }

  if (selectedNode.data.type === 'entity') {
    return <EntityNodePropertiesForm node={selectedNode as EntityNodeType} />;
  }
};

const EntityNodePropertiesForm = ({ node }: { node: EntityNodeType }) => {
  const ontologies = useMappingPage(state => state.ontologies);
  const reactflow = useReactFlow();
  const [label, setLabel] = useState(node.data.label);
  const [uriPattern, setUriPattern] = useState(node.data.uri_pattern);
  const [rdfType, setRdfType] = useState<(OntologyClass & { group: string })[]>(
    [],
  );
  // Update node_data when fields change
  useEffect(() => {
    reactflow.setNodes(nodes =>
      nodes.map(n => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label,
              uri_pattern: uriPattern,
              rdf_type: rdfType.map(c => c.full_uri),
            },
          };
        }
        return n;
      }),
    );
  }, [label, uriPattern, rdfType, node.id, reactflow]);

  useEffect(() => {
    if (ontologies) {
      const rdfTypes = node.data.rdf_type
        .map(
          uri =>
            ontologies.flatMap(o => o.classes).find(c => c.full_uri === uri) ||
            ({
              full_uri: uri,
              label: [{ value: uri }],
              belongs_to: '',
              super_classes: [],
              type: 'class',
              group: 'Create',
              description: [],
              is_deprecated: false,
            } as OntologyClass & { group: string }),
        )
        .map(c => ({
          ...c,
          group: c.belongs_to,
        }));
      setRdfType(rdfTypes);
    }
    // This effect should only run when the ontologies or the node id changes
    // Otherwise, it will run every time the label, uriPattern or rdfType changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ontologies, node.id]);

  const possibleClasses = useClassOrderer(node);

  const createNewItemFromQuery = (query: string) => {
    return {
      full_uri: query,
      label: [{ value: query }],
      belongs_to: '',
      super_classes: [],
      type: 'class',
      group: 'Create',
      description: [],
      is_deprecated: false,
    } as OntologyClass & { group: string };
  };

  const createNewItemRenderer = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>,
  ) => (
    <MenuItem
      key={query}
      text={`Create "${query}"`}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        try {
          new URL(query);
        } catch {
          toast.show({
            message: 'Invalid URI, please enter a valid URI',
            intent: 'danger',
          });
          return;
        }
        handleClick(e);
      }}
      active={active}
    />
  );

  const itemListRenderer = (
    props: ItemListRendererProps<OntologyClass & { group: string }>,
  ) => {
    return (
      <GroupedSelectRenderer<OntologyClass & { group: string }>
        listProps={props}
        initialContent={<MenuItem disabled text='No classes' />}
        noResults={<MenuItem disabled text='No results' />}
        getGroup={item => item.group}
      />
    );
  };

  const tagRenderer = (item: OntologyClass & { group: string }) => {
    const ontology = ontologies?.find(o => o.base_uri === item.belongs_to);
    if (ontology) {
      return `${ontology.name}:${item.label[0].value}`;
    }
    return item.label[0].value;
  };

  return (
    <>
      <FormGroup label='Label' labelFor='label'>
        <InputGroup
          id='label'
          value={label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLabel(e.target.value)
          }
        />
      </FormGroup>
      <FormGroup label='RDF Types' labelFor='rdfType'>
        <MultiSelect<OntologyClass & { group: string }>
          fill
          popoverProps={{
            matchTargetWidth: true,
          }}
          onRemove={item => setRdfType(rdfType.filter(c => c !== item))}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              role='menuitem'
              key={item.full_uri}
              label='Class'
              text={item.label[0].value ?? item.full_uri}
              onClick={handleClick}
              active={modifiers.active}
            />
          )}
          itemPredicate={(query, item) =>
            item.label[0].value.toLowerCase().includes(query.toLowerCase())
          }
          items={possibleClasses.classes.filter(
            c => !rdfType.some(r => r.full_uri === c.full_uri),
          )}
          onItemSelect={item => {
            try {
              new URL(item.full_uri);
            } catch {
              toast.show({
                message: 'Invalid URI, please enter a valid URI',
                intent: 'danger',
              });
              return;
            }
            if (!rdfType.some(c => c.full_uri === item.full_uri)) {
              setRdfType([...rdfType, item]);
            }
          }}
          selectedItems={rdfType}
          itemListRenderer={itemListRenderer}
          tagRenderer={tagRenderer}
          createNewItemFromQuery={createNewItemFromQuery}
          createNewItemRenderer={createNewItemRenderer}
          itemsEqual={(a, b) => a.full_uri === b.full_uri}
          resetOnQuery
          resetOnSelect
        />
      </FormGroup>
      <FormGroup label='URI Pattern' labelFor='uriPattern'>
        <InputGroup
          id='uriPattern'
          value={uriPattern}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUriPattern(e.target.value)
          }
        />
      </FormGroup>
    </>
  );
};

export default NodeProperties;
