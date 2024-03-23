'use client';

import { PrefixModel } from '@/lib/models/PrefixModel';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type _AssignPrefixDialogProps = {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: (id: string) => void;
    prefixes: PrefixModel[];
};

type _AssignPrefixDialogState = {
    prefixId: string;
    prefixError: string | null;
};

const AssignPrefixDialog = ({
    open,
    onClose,
    onConfirm,
    loading,
    prefixes,
}: _AssignPrefixDialogProps) => {
    const ref = useRef<HTMLFormElement>(null);
    const [state, setState] = useState<_AssignPrefixDialogState>({
        prefixId: '',
        prefixError: null,
    });

    useEffect(() => {
        if (!open) {
            setState({
                prefixId: '',
                prefixError: null,
            });
        }
    }, [open]);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>Assign prefix</DialogTitle>
                <form
                    ref={ref}
                    onSubmit={(e) => {
                        e.preventDefault();
                        let prefixError = null;

                        if (!state.prefixId) {
                            prefixError = 'Prefix is required';
                        }

                        if (prefixError) {
                            setState({ ...state, prefixError });
                            return;
                        }
                        onConfirm(state.prefixId);
                    }}
                >
                    <DialogContent>
                        <Autocomplete
                            options={prefixes}
                            getOptionLabel={(option) => option.prefix}
                            getOptionKey={(option) => option.id}
                            onChange={(_, value) => {
                                if (!value) return;
                                setState({ ...state, prefixId: value._id });
                            }}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin='dense'
                                    id='prefix'
                                    label='Prefix'
                                    type='text'
                                    fullWidth
                                    error={!!state.prefixError}
                                    helperText={state.prefixError}
                                    disabled={loading}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={onClose}
                            color='primary'
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            color='primary'
                            disabled={loading}
                        >
                            Assign
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AssignPrefixDialog;
