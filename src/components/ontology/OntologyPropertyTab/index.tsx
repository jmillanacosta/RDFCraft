'use client';

import {
  OntologyClassDocument,
  OntologyPropertyDocument,
} from '@/lib/models/OntologyIndexModel';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { useState } from 'react';

const OntologyPropertyTab = ({
  open,
  properties,
  selected,
  goToClass,
}: {
  open: boolean;
  properties: OntologyPropertyDocument[];
  selected: string;
  goToClass: (uri: string) => void;
}) => {
  const [search, setSearch] = useState('');

  const [expanded, setExpanded] = useState<string[]>([]);

  const filteredProperties = properties.filter(c => {
    if (search === '') return true;
    return (
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.full_uri.toLowerCase().includes(search.toLowerCase()) ||
      c.property_domain
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.property_range.join(' ').toLowerCase().includes(search.toLowerCase())
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
        selected={[selected]}
        multiSelect
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
            <Box>
              <Typography>
                <strong>URI: </strong>
                {c.full_uri}
              </Typography>

              <Typography>
                <strong>Description: </strong>
                {c.description}
              </Typography>
              <TreeItem
                key={c.full_uri + '-domain'}
                nodeId={c.full_uri + '-domain'}
                label={
                  c.property_domain.length === 0
                    ? 'Domains - Not found'
                    : 'Domains'
                }
              >
                {c.property_domain.map(d => (
                  <TreeItem
                    key={c.full_uri + '-domain-' + d}
                    nodeId={c.full_uri + '-domain-' + d}
                    label={d}
                    onClick={() => {
                      goToClass(d);
                    }}
                  />
                ))}
              </TreeItem>
              <TreeItem
                key={c.full_uri + '-range'}
                nodeId={c.full_uri + '-range'}
                label={
                  c.property_range.length === 0
                    ? 'Ranges - Not found'
                    : 'Ranges'
                }
              >
                {c.property_domain.map(r => (
                  <TreeItem
                    key={c.full_uri + '-range-' + r}
                    nodeId={c.full_uri + '-range-' + r}
                    label={r}
                    onClick={() => {
                      goToClass(c.full_uri);
                    }}
                  />
                ))}
              </TreeItem>
            </Box>
          </TreeItem>
        ))}
      </TreeView>
    </Box>
  );
};

export default OntologyPropertyTab;
