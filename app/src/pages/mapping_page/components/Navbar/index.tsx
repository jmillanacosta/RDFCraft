import { Navbar as BPNavbar, Button, ButtonGroup } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

type NavbarProps = {
  uuid: string | undefined;
  mapping_uuid: string | undefined;
};

const Navbar = ({ uuid, mapping_uuid }: NavbarProps) => {
  const navigation = useNavigate();

  return (
    <BPNavbar fixedToTop>
      <BPNavbar.Group>
        <Button
          icon='arrow-left'
          minimal
          onClick={() => {
            navigation(`/workspaces/${uuid}`);
          }}
        />
        <div style={{ width: 10 }} />
        <BPNavbar.Heading>Workspace: {mapping_uuid}</BPNavbar.Heading>
        <BPNavbar.Divider />
        <BPNavbar.Heading></BPNavbar.Heading>
      </BPNavbar.Group>
      <BPNavbar.Group align='right'>
        <ButtonGroup>
          <Button icon='floppy-disk'>Save</Button>
          <Button icon='rocket'>Map</Button>
        </ButtonGroup>
      </BPNavbar.Group>
    </BPNavbar>
  );
};

export default Navbar;
