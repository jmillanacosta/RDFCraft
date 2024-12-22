import { Card } from '@blueprintjs/core';
import NodeProperties from '../NodeProperties';

type SidePanelProps = {
  selectedTab: string | undefined;
};

const SidePanel = ({ selectedTab }: SidePanelProps) => {
  const panelContent = () => {
    switch (selectedTab) {
      case 'properties':
        return <NodeProperties />;
      case 'ai':
        return <div>AI Panel Content</div>;
      case 'references':
        return <div>Source References Panel Content</div>;
      case 'search':
        return <div>Search Panel Content</div>;
      case 'settings':
        return <div>Settings Panel Content</div>;
      default:
        return <NodeProperties />;
    }
  };

  return (
    <div className='side-panel' style={{ height: '100%' }}>
      <Card
        style={{
          height: '100%',
          overflowY: 'auto',
          position: 'relative',
          // closer to bp5 dark theme
          background: '#182026',
        }}
      >
        {panelContent()}
      </Card>
    </div>
  );
};

export default SidePanel;
