import { LiteralNodeDataModel } from '@/lib/models/MappingModel';
import useMappingStore from '@/lib/stores/MappingStore';
import Editor from '@monaco-editor/react';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';
import useRefValidator from '../../hooks/useRefValidator';

export default function DataNode({
    id,
    selected,
    data,
}: {
    id: string;
    selected: boolean;
    data: LiteralNodeDataModel;
}) {
    const [valueError, setValueError] = useState<string | null>(null);

    const updateNodeData = useMappingStore((state) => state.updateNodeData);
    const valueRefs =
        useMappingStore((state) => state.mappingDocument?.source.refs) || [];

    const valueReferenceError = useRefValidator(data.pattern, valueRefs);

    if (!data) return null;

    return (
        <>
            <NodeResizer
                color='#ff0071'
                isVisible={selected}
                handleStyle={{
                    background: '#ff0071',
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                }}
                minWidth={300}
                minHeight={300}
                maxHeight={500}
                maxWidth={500}
            />

            <Handle
                type='source'
                className='source_handle'
                position={Position.Top}
                id='a'
            />
            <Handle
                type='source'
                className='source_handle'
                position={Position.Left}
                id='b'
                style={{ rotate: '-90deg' }}
            />
            <Box
                padding={5}
                bgcolor='#201e1e'
                borderRadius={5}
                sx={{
                    height: '100%',
                }}
            >
                <TextField
                    autoFocus
                    className='nodrag'
                    disabled
                    defaultValue={
                        data.rdf_type.includes('#')
                            ? data.rdf_type.split('#')[1]
                            : data.rdf_type
                    }
                    margin='dense'
                    id='valueType'
                    label='Value Type'
                    type='text'
                    fullWidth
                    variant='standard'
                />

                <Box height={10} />
                <Editor
                    defaultLanguage='turtle'
                    onChange={(value) => {
                        updateNodeData(id, {
                            ...data,
                            pattern: value || '',
                        });
                    }}
                    options={{
                        renderLineHighlight: 'none',
                        quickSuggestions: false,
                        glyphMargin: false,
                        lineDecorationsWidth: 0,
                        folding: false,
                        fixedOverflowWidgets: true,
                        acceptSuggestionOnEnter: 'on',
                        hover: {
                            delay: 100,
                        },
                        roundedSelection: false,
                        contextmenu: false,
                        cursorStyle: 'line-thin',
                        occurrencesHighlight: 'off',
                        links: false,
                        minimap: { enabled: false },
                        // see: https://github.com/microsoft/monaco-editor/issues/1746
                        wordBasedSuggestions: 'off',
                        // disable `Find`
                        find: {
                            addExtraSpaceOnTop: false,
                            autoFindInSelection: 'never',
                            seedSearchStringFromSelection: 'never',
                        },
                        fontSize: 14,
                        fontWeight: 'normal',
                        wordWrap: 'off',
                        lineNumbers: 'off',
                        lineNumbersMinChars: 0,
                        overviewRulerLanes: 0,
                        overviewRulerBorder: false,
                        hideCursorInOverviewRuler: true,
                        scrollBeyondLastColumn: 0,
                        scrollbar: {
                            horizontal: 'hidden',
                            vertical: 'hidden',
                            // avoid can not scroll page when hover monaco
                            alwaysConsumeMouseWheel: false,
                        },
                    }}
                />
            </Box>
            <Handle
                className='source_handle'
                type='source'
                position={Position.Right}
                id='c'
                style={{ rotate: '90deg' }}
            />
            <Handle
                type='source'
                className='source_handle'
                position={Position.Bottom}
                id='d'
            />
        </>
    );
}
