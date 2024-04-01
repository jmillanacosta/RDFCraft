import { CopyAll } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function MappingCompleteDialog({
  open,
  onClose,
  yarrrml,
  rml,
  rdf,
}: {
  open: boolean;
  onClose: () => void;
  yarrrml: string;
  rml: string;
  rdf: string;
}) {
  // Large dialog with two tabs
  // First tab: YARRRML
  // Second tab: RDF

  const [tab, setTab] = useState(0);

  // There are lots of empty newlines in the YARRRML output
  // Delete all empty newlines
  const cleanedYarrrml = yarrrml.replace(/^\s*[\r\n]/gm, '');

  return (
    <Dialog open={open} fullWidth maxWidth='lg' onClose={onClose}>
      <DialogTitle>Mapping complete!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your mapping is complete! You can copy the YARRRML or RDF below.
        </DialogContentText>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label='YARRRML' />
          <Tab label='RML' />
          <Tab label='RDF' />
        </Tabs>

        <TextField
          value={tab === 0 ? cleanedYarrrml : tab === 1 ? rml : rdf}
          fullWidth
          multiline
          variant='outlined'
          rows={10}
          InputProps={{
            // copy button
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(tab === 0 ? yarrrml : rdf);
                  }}
                >
                  <CopyAll />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Typography>Close</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
