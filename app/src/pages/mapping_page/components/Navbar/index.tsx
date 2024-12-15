import { Navbar as BPNavbar, Button, ButtonGroup } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

type NavbarProps = {
  uuid: string | undefined;
  name: string | undefined;
  isLoading: string | null;
  onSave: () => void;
};

const Navbar = ({ uuid, name, isLoading, onSave }: NavbarProps) => {
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
        <BPNavbar.Heading>Mapping: {name}</BPNavbar.Heading>
        <BPNavbar.Divider />
        <BPNavbar.Heading>
          {isLoading ? <>{isLoading}</> : null}
        </BPNavbar.Heading>
      </BPNavbar.Group>
      <BPNavbar.Group align='right'>
        <ButtonGroup>
          <Button icon='floppy-disk' onClick={onSave}>
            Save
          </Button>
          <Button icon='rocket'>Map</Button>
        </ButtonGroup>
      </BPNavbar.Group>
    </BPNavbar>
  );
};

export default Navbar;
