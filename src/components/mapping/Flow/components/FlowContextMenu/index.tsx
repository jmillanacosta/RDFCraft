import { Menu, MenuItem } from '@mui/material';

const FlowContextMenu = ({
  open,
  contextMenuLocation,
  handleCloseContextMenu,
  addNode,
}: {
  open: boolean;
  contextMenuLocation: [number, number] | null;
  handleCloseContextMenu: () => void;
  addNode: () => void;
}) => {
  return (
    <Menu
      open={open}
      onClose={handleCloseContextMenu}
      anchorReference='anchorPosition'
      anchorPosition={
        contextMenuLocation !== null
          ? {
              top: contextMenuLocation[1],
              left: contextMenuLocation[0],
            }
          : undefined
      }
    >
      <MenuItem onClick={addNode}>Add Node</MenuItem>
    </Menu>
  );
};

export default FlowContextMenu;
