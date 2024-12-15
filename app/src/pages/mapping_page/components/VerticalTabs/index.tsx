import { Button } from '@blueprintjs/core';
import { SetStateAction } from 'react';
import {
  VscBook,
  VscPlug,
  VscSymbolProperty,
  VscGear,
} from 'react-icons/vsc';

type VerticalTabsProps = {
  selectedTab: string | undefined;
  isCollapsed: boolean;
  handleTabClick: (tabId: SetStateAction<string | undefined>) => void;
};

const tabs = [
  { id: 'properties', label: 'Node Properties', icon: <VscSymbolProperty /> },
  { id: 'ai', label: 'AI', icon: <VscPlug /> },
  { id: 'references', label: 'Source References', icon: <VscBook /> },
  { id: 'settings', label: 'Settings', icon: <VscGear /> },
];

const VerticalTabs = ({ selectedTab, isCollapsed, handleTabClick }: VerticalTabsProps) => {
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