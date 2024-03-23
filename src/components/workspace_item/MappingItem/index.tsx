'use client';

import { ItemCard } from '@/components/general/ItemCard';
import { MappingDocument } from '@/lib/models/MappingModel';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const MappingItem = ({
    workspaceID,
    mapping,
    onDelete,
}: {
    workspaceID: string;
    mapping: MappingDocument;
    onDelete: () => void;
}) => {
    const router = useRouter();
    const onSelect = useCallback(() => {
        router.push(
            `/workspace/${workspaceID}/mapping/${mapping._id || mapping.id}`,
        );
    }, [mapping._id, router, mapping.id, workspaceID]);

    return (
        <>
            <ItemCard
                name={mapping.name}
                description={mapping.source.description}
                secondaryDescription={`ID: ${mapping._id || mapping.id}`}
            >
                <Button variant='contained' onClick={onSelect}>
                    <Typography>Select</Typography>
                </Button>
                <Button variant='contained' color='error' onClick={onDelete}>
                    <Typography>Delete</Typography>
                </Button>
            </ItemCard>
        </>
    );
};

export default MappingItem;
