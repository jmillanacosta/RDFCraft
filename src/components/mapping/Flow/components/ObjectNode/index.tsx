'use client';

import { ObjectNodeDataModel } from '@/lib/models/MappingModel';
import { Autocomplete, Box, TextField } from '@mui/material';

import { OntologyClassDocument } from '@/lib/models/OntologyIndexModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { CodeInput } from '@djgrant/react-code-input';
import { useCallback, useMemo, useState } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';
import usePossibleClasses from '../../hooks/usePossibleClasses';
import useRefValidator from '../../hooks/useRefValidator';

export default function ObjectNode({
    id,
    selected,
    data,
}: {
    id: string;
    data: ObjectNodeDataModel;
    selected: boolean;
}) {
    const updateNodeData = useMappingStore((state) => state.updateNodeData);
    const ontologies = useMappingStore((state) => state.workspace?.ontologies);
    const valueRefs =
        useMappingStore((state) => state.mappingDocument?.source.refs) || [];

    const node = useMappingStore((state) =>
        state.nodes.find((node) => node.id === id),
    );

    const IRIError = useRefValidator(data.pattern, valueRefs);

    // TODO: make this a hook
    const possibleClasses = usePossibleClasses(id);

    const value = useMemo(() => {
        const value = possibleClasses.find(
            (cls) => cls.full_uri === data.rdf_type,
        );
        return value;
    }, [data.rdf_type, possibleClasses]);

    const [uriOld, setUriOld] = useState<string>('');

    const changeLabel = useCallback(
        (label: string) => {
            updateNodeData(id, {
                ...data,
                label,
            });
        },
        [id, data, updateNodeData],
    );

    const changeClass = useCallback(
        (cls: OntologyClassDocument | null) => {
            const prefix =
                ontologies?.find((o) => o.id === cls?.ontology_id)?.prefix
                    .prefix || '';
            updateNodeData(id, {
                ...data,
                rdf_type: cls?.full_uri || '',
                pattern_prefix: prefix,
            });
        },
        [id, data, updateNodeData, ontologies],
    );

    const changeIRI = useCallback(
        (IRI: string) => {
            updateNodeData(id, {
                ...data,
                pattern: IRI,
            });
            setUriOld(IRI);
        },
        [id, data, updateNodeData],
    );

    if (!data) return <></>;

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
                    defaultValue={data.label}
                    margin='dense'
                    id='label'
                    label='Label'
                    type='text'
                    fullWidth
                    variant='standard'
                    onChange={(e) => changeLabel(e.target.value)}
                />
                <Box height={10} />
                <Autocomplete
                    options={possibleClasses}
                    groupBy={(option) =>
                        ontologies?.find(
                            (o) =>
                                o.id === option.ontology_id ||
                                o._id === option.ontology_id,
                        )?.prefix.prefix || 'no prefix'
                    }
                    value={value || null}
                    className='nodrag'
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                        changeClass(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Class'
                            variant='outlined'
                        />
                    )}
                />
                <Box height={10} />

                {/* <Autocomplete
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='URI'
                            variant='outlined'
                            onChange={(e) => {
                                changeIRI(e.target.value);
                            }}
                        />
                    )}
                    className='nodrag'
                    value={data.pattern}
                    freeSolo
                    autoSelect
                    options={[
                        ...valueRefs.map((ref) => `$(${ref})`),
                        ...(ontologies?.map((o) => `${o.prefix.prefix}:`) ||
                            []),
                    ]}
                    // Show options on every possible moment

                    filterOptions={(options, params) => {
                        const normalFound = options.filter((ref) =>
                            ref.startsWith(params.inputValue),
                        );
                        if (normalFound.length > 0) {
                            return normalFound;
                        }
                        // Regex to match $(dsdsdsd) without the closing bracket
                        const matches = params.inputValue.match(/\$\([^\)]*$/);

                        if (matches !== null && matches[0]) {
                            return options.filter((ref) =>
                                ref.startsWith(matches[0]),
                            );
                        }

                        return [];
                    }}
                    onChange={(
                        event: SyntheticEvent<Element, Event>,
                        value: string | null,
                        reason: AutocompleteChangeReason,
                        details: AutocompleteChangeDetails | undefined,
                    ) => {
                        if (value!) {
                            changeIRI('');
                        }
                        if (reason === 'selectOption') {
                            // Complete the rest of the token
                            if (!details?.option) return;
                            let old = uriOld;
                            if (details.option.startsWith('$')) {
                                // Delete colliding part from the end of the old string
                                const matches = old.match(/\$\([^\)]*$/);
                                if (matches !== null && matches[0]) {
                                    old = old.replace(matches[0], '');
                                    // Delete last character if it is a $
                                    old = old.replace(/\$$/, '');
                                }
                            }
                            if (details.option.endsWith(':')) {
                                // Delete colliding part if exists
                            }
                            changeIRI(old + details.option);
                            return;
                        }
                        if (reason === 'clear') {
                            changeIRI('');
                            return;
                        }
                        changeIRI(event.currentTarget?.textContent || '');
                    }}
                /> */}
                <CodeInput
                    symbols={[
                        ...(valueRefs.map((ref) => `$(${ref})`) || []),
                        ...(ontologies?.map((o) => `${o.prefix.prefix}:`) ||
                            []),
                    ]}
                    placeholder='URI'
                    className='nodrag input'
                    style={{
                        display: 'block',
                        width: '100%',
                        marginBottom: '10px',
                    }}
                    onChange={(e: any) => {
                        if (!e.currentTarget) return;

                        updateNodeData(id, {
                            ...data,
                            pattern: (e.currentTarget.value as string) || '',
                        });
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
