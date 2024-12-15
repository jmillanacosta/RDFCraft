import { ReactFlowProvider } from '@xyflow/react';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import useErrorToast from '../../hooks/useErrorToast';
import MainPanel from './components/MainPanel';
import Navbar from './components/Navbar';
import SidePanel from './components/SidePanel';
import VerticalTabs from './components/VerticalTabs';
import useMappingPage from './state';
import './styles.scss';

type MappingPageURLProps = {
  uuid: string;
  mapping_uuid: string;
};

const MappingPage = () => {
  const props = useParams<MappingPageURLProps>();
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mapping = useMappingPage(state => state.mapping);
  const isLoading = useMappingPage(state => state.isLoading);
  const error = useMappingPage(state => state.error);
  const loadMapping = useMappingPage(state => state.loadMapping);
  const saveMapping = useMappingPage(state => state.saveMapping);

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

  useEffect(() => {
    if (props.uuid && props.mapping_uuid) {
      loadMapping(props.uuid, props.mapping_uuid);
    }
  }, [props.uuid, props.mapping_uuid, loadMapping]);

  useErrorToast(error);

  const handleTabClick = (tabId: SetStateAction<string | undefined>) => {
    if (selectedTab === tabId && !isCollapsed) {
      setIsCollapsed(true);
    } else {
      setSelectedTab(tabId);
      setIsCollapsed(false);
    }
  };

  const handleSave = () => {
    if (mapping && props.uuid && props.mapping_uuid) {
      saveMapping(props.uuid, props.mapping_uuid, mapping);
    }
  };

  return (
    <ReactFlowProvider>
      <div className='mapping-page'>
        <Navbar
          uuid={props.uuid}
          name={mapping?.name}
          isLoading={isLoading}
          onSave={handleSave}
        />
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
              <MainPanel initialGraph={mapping} />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default MappingPage;
