import GroupedSelectRenderer from '@/components/GroupedSelectRenderer';
import OneLineMonaco from '@/components/OneLineMonacoEditor';
import toast from '@/consts/toast';
import { LiteralNodeType } from '@/pages/mapping_page/components/MainPanel/types';
import useClassOrderer from '@/pages/mapping_page/hooks/useClassOrderer';
import { FormGroup, H5, InputGroup, MenuItem } from '@blueprintjs/core';
import { ItemListRendererProps, Select } from '@blueprintjs/select';
import { useReactFlow } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

import { xsdTypes } from '@/consts/xsdTypes';
import { NamedNode, OntologyClass } from '@/lib/api/ontology_api/types';
import './styles.scss';

const LiteralNodeProperties = ({ node }: { node: LiteralNodeType }) => {
  const reactflow = useReactFlow();

  const dataType = useMemo<(OntologyClass & { group: string }) | null>(() => {
    const dataType = xsdTypes.find(t => t.full_uri === node.data.literal_type);
    if (dataType) {
      return {
        ...dataType,
        group: 'XML Schema',
      };
    }
    return null;
  }, [node.data.literal_type]);

  const possibleClasses = useClassOrderer(node);

  const updateNode = useCallback(
    (
      label: string | null,
      literalType: string | null,
      value: string | null,
    ) => {
      reactflow.updateNode(node.id, {
        data: {
          ...node.data,
          label: label ?? node.data.label,
          literal_type: literalType ?? node.data.literal_type,
          value: value ?? node.data.value,
        },
      });
    },
    [node, reactflow],
  );

  const itemSearch = (query: string, item: NamedNode & { group: string }) => {
    if (item.label.length > 0) {
      return item.label[0].value.toLowerCase().includes(query.toLowerCase());
    }
    return item.full_uri.toLowerCase().includes(query.toLowerCase());
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

  const createNewTypeItemFromQuery = (query: string) => {
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

  const itemListRenderer = (
    props: ItemListRendererProps<NamedNode & { group: string }>,
  ) => {
    return (
      <GroupedSelectRenderer<NamedNode & { group: string }>
        listProps={props}
        initialContent={<MenuItem disabled text='No classes' />}
        noResults={<MenuItem disabled text='No results' />}
        getGroup={item => item.group}
      />
    );
  };

  const tagRenderer = (item: NamedNode & { group: string }) => {
    if (!item) return '';
    if (item.label.length > 0) {
      return item.label[0].value;
    }
    return item.full_uri;
  };

  const createItemList = (): (NamedNode & { group: string })[] => {
    const bestFits = possibleClasses.classes
      .map(c => {
        const type = xsdTypes.find(t => t.full_uri === c.full_uri);
        if (type) {
          return {
            ...type,
            group: c.group,
          };
        }
      })
      .filter(Boolean) as (OntologyClass & { group: string })[];
    const others = xsdTypes.filter(
      t => !bestFits.find(b => b.full_uri === t.full_uri),
    );

    return [
      ...bestFits,
      ...others.map(t => ({
        ...t,
        group: 'XML Schema',
      })),
    ];
  };

  return (
    <>
      <H5>Literal Node</H5>
      <FormGroup label='Label' labelFor='label'>
        <InputGroup
          id='label'
          value={node.data.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateNode(e.target.value, null, null)
          }
        />
      </FormGroup>
      <FormGroup label='Data Type' labelFor='rdfType'>
        <Select<NamedNode & { group: string }>
          fill
          popoverProps={{
            matchTargetWidth: true,
            popoverClassName: 'popover-scroll',
          }}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              role='menuitem'
              key={item.full_uri}
              label='Data Type'
              text={tagRenderer(item)}
              onClick={handleClick}
              active={modifiers.active}
            />
          )}
          itemPredicate={itemSearch}
          items={createItemList()}
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
            updateNode(null, item.full_uri, null);
          }}
          itemListRenderer={itemListRenderer}
          createNewItemFromQuery={createNewTypeItemFromQuery}
          createNewItemRenderer={createNewItemRenderer}
          itemsEqual={(a, b) => a.full_uri === b.full_uri}
          resetOnQuery
          resetOnSelect
        >
          <InputGroup
            id='rdfType'
            value={tagRenderer(dataType as NamedNode & { group: string })}
            readOnly
          />
        </Select>
      </FormGroup>

      <FormGroup label='Value' labelFor='value'>
        <OneLineMonaco
          onChange={(value: string | undefined) =>
            updateNode(null, null, value ?? '')
          }
          value={node.data.value}
          language='mapping_language'
          theme='mapping-theme'
        />
      </FormGroup>
    </>
  );
};

export default LiteralNodeProperties;
