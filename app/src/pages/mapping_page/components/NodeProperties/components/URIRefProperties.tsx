import OneLineMonaco from '@/components/OneLineMonacoEditor';
import { URIRefNodeType } from '@/pages/mapping_page/components/MainPanel/types';
import { FormGroup, H5 } from '@blueprintjs/core';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

import './styles.scss';

const URIRefProperties = ({ node }: { node: URIRefNodeType }) => {
  const reactflow = useReactFlow();

  const updateNode = useCallback(
    (uriPattern: string | null) => {
      if (uriPattern === null) {
        return;
      }
      reactflow.updateNode(node.id, {
        data: {
          ...node.data,
          uri_pattern: uriPattern ?? node.data.uri_pattern,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [node.id, reactflow],
  );

  return (
    <>
      <H5>URI Reference Node</H5>
      <FormGroup label='URI Pattern' labelFor='uriPattern'>
        <OneLineMonaco
          onChange={(value: string | undefined) => updateNode(value ?? null)}
          value={node.data.uri_pattern}
          language='mapping_language'
          theme='mapping-theme'
        />
      </FormGroup>
    </>
  );
};

export default URIRefProperties;
