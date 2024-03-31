'use client';

import { MappingModel } from '@/lib/models/MappingModel';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

type ImportExportDialogProps = {
  open: boolean;
  onClose: () => void;
  onImport: (data: Partial<MappingModel>) => void;
  data: Partial<MappingModel>;
};

const ImportExportDialog = (props: ImportExportDialogProps) => {
  // A two section dialog
  // One shows the current mapping model as a JSON string with a button to copy it
  // The other allows the user to paste a JSON string and import it

  const [importData, setImportData] = useState<string>('');

  const json = useMemo(() => JSON.stringify(props.data, null, 2), [props.data]);

  return (
    <>
      <Dialog open={props.open} onClose={props.onClose} fullWidth>
        <DialogTitle>Import/Export</DialogTitle>
        <DialogContent>
          <TextField
            value={json}
            style={{ width: '100%' }}
            minRows={10}
            maxRows={15}
            multiline
            disabled
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(props.data, null, 2),
              );
              enqueueSnackbar('Copied to clipboard', { variant: 'success' });
            }}
          >
            Copy
          </Button>
          <Divider />
          <TextField
            multiline
            fullWidth
            style={{ width: '100%' }}
            minRows={10}
            maxRows={15}
            value={importData}
            onChange={e => setImportData(e.target.value)}
          />
          <Button
            onClick={() => {
              try {
                const data = JSON.parse(importData);
                props.onImport(data);
              } catch (e) {
                enqueueSnackbar('Invalid JSON', { variant: 'error' });
              }
            }}
          >
            Import
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportExportDialog;
