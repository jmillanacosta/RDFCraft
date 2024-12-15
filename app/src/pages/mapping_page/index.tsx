import { SetStateAction, useEffect, useRef, useState } from 'react';
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import MainPanel from './components/MainPanel';
import Navbar from './components/Navbar';
import SidePanel from './components/SidePanel';
import VerticalTabs from './components/VerticalTabs';
import './styles.scss';

type MappingPageURLProps = {
  uuid: string;
  mapping_uuid: string;
};

const MappingPage = () => {
  const props = useParams<MappingPageURLProps>();
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidePanelHandle = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (sidePanelHandle.current) {
      if (isCollapsed) {
        sidePanelHandle.current.collapse();
      } else {
        sidePanelHandle.current.expand();
      }
    }
  }, [isCollapsed]);

  const handleTabClick = (tabId: SetStateAction<string | undefined>) => {
    if (selectedTab === tabId && !isCollapsed) {
      setIsCollapsed(true);
    } else {
      setSelectedTab(tabId);
      setIsCollapsed(false);
    }
  };

  return (
    <div className='mapping-page'>
      <Navbar uuid={props.uuid} mapping_uuid={props.mapping_uuid} />
      <div className='mapping-page-content'>
        <PanelGroup direction='horizontal' style={{ height: '100%' }}>
          <VerticalTabs
            selectedTab={selectedTab}
            isCollapsed={isCollapsed}
            handleTabClick={handleTabClick}
          />
          <Panel
            ref={sidePanelHandle}
            collapsible
            collapsedSize={0}
            onCollapse={() => setIsCollapsed(true)}
            defaultSize={20}
            minSize={10}
            maxSize={50}
          >
            <SidePanel selectedTab={selectedTab} />
          </Panel>
          {!isCollapsed && (
            <PanelResizeHandle className='resize-handle'></PanelResizeHandle>
          )}
          <Panel>
            <MainPanel />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default MappingPage;
