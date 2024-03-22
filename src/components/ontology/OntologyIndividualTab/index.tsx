'use client';

import { OntologyIndividualModel } from '@/lib/models/OntologyIndexModel';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { useState } from 'react';

const OntologyIndividualTab = ({
  open,
  individuals,
}: {
  open: boolean;
  individuals: OntologyIndividualModel[];
}) => {
  const [search, setSearch] = useState('');

  const [expanded, setExpanded] = useState<string[]>([]);

  const filteredProperties = individuals.filter(c => {
    if (search === '') return true;
    return (
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.full_uri.toLowerCase().includes(search.toLowerCase())
    );
  });
  // With tree view
  return (
    <Box
      style={{
        display: open ? 'block' : 'none',
        margin: '10px',
      }}
    >
      <TextField
        label='Search'
        value={search}
        onChange={e => setSearch(e.target.value)}
      ></TextField>
      <Divider
        sx={{
          margin: '10px 0',
        }}
      />
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        expanded={expanded}
        onNodeToggle={(event, nodes) => {
          setExpanded(nodes);
        }}
      >
        {filteredProperties.length === 0 && (
          <Typography>No properties found</Typography>
        )}
        {filteredProperties.map(c => (
          <TreeItem
            key={c.full_uri}
            nodeId={c.full_uri}
            id={c.full_uri}
            label={
              <Typography
                sx={{
                  textDecoration: c.is_deprecated ? 'line-through' : 'none',
                }}
              >
                {c.label}
              </Typography>
            }
          >
            <Box key={`box-${c.full_uri}`}>
              <Typography>
                <strong>URI: </strong>
                {c.full_uri}
              </Typography>

              <Typography>
                <strong>Description: </strong>
                {c.description}
              </Typography>
            </Box>
          </TreeItem>
        ))}
      </TreeView>
    </Box>
  );
};

export default OntologyIndividualTab;
