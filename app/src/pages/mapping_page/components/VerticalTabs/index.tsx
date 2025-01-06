import { SelectedTab } from '@/pages/mapping_page/state';
import { Button } from '@blueprintjs/core';
import {
  VscBook,
  VscPlug,
  VscSearch,
  VscSymbolProperty,
  VscWarning,
} from 'react-icons/vsc';

type VerticalTabsProps = {
  selectedTab: SelectedTab;
  isCollapsed: boolean;
  handleTabClick: (tabId: string) => void;
};

const tabs: { id: string; label: string; icon: JSX.Element }[] = [
  { id: 'properties', label: 'Node Properties', icon: <VscSymbolProperty /> },
  { id: 'ai', label: 'AI', icon: <VscPlug /> },
  { id: 'search', label: 'Search', icon: <VscSearch /> },
  { id: 'problems', label: 'Problems', icon: <VscWarning /> },
  { id: 'references', label: 'Source References', icon: <VscBook /> },
];

const VerticalTabs = ({
  selectedTab,
  isCollapsed,
  handleTabClick,
}: VerticalTabsProps) => {
  return (
    <div className='vertical-tabs'>
      {tabs.map(tab => (
        <Button
          key={tab.id}
          minimal
          icon={tab.icon}
          active={selectedTab === tab.id && !isCollapsed}
          onClick={() => handleTabClick(tab.id)}
          title={tab.label}
          style={{ marginBottom: '5px' }}
        />
      ))}
    </div>
  );
};

export default VerticalTabs;
