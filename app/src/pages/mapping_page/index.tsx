import { ReactFlowProvider } from '@xyflow/react';
import { languages } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import useRegisterCompletionItemProvider from '../../components/OneLineMonacoEditor/hooks/useRegisterCompletionItemProvider';
import useRegisterLanguage from '../../components/OneLineMonacoEditor/hooks/useRegisterLanguage';
import useRegisterTheme from '../../components/OneLineMonacoEditor/hooks/useRegisterTheme';
import { mapping_language } from '../../consts/mapping-language';
import mapping_theme from '../../consts/mapping-theme';
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
  const [selectedTab, setSelectedTab] = useState<
    'properties' | 'ai' | 'references' | 'search' | 'settings'
  >('properties');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mapping = useMappingPage(state => state.mapping);
  const source = useMappingPage(state => state.source);
  const prefixes = useMappingPage(state => state.prefixes);
  const isLoading = useMappingPage(state => state.isLoading);
  const error = useMappingPage(state => state.error);
  const loadMapping = useMappingPage(state => state.loadMapping);
  const saveMapping = useMappingPage(state => state.saveMapping);

  useRegisterTheme('mapping-theme', mapping_theme);
  useRegisterLanguage('mapping_language', mapping_language, {});
  useRegisterCompletionItemProvider('mapping_language', [
    {
      provideCompletionItems(model, position, context, token) {
        const word = model.getWordUntilPosition(position);

        const range = {
          startLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: word.endColumn,
        };
        return {
          suggestions: [
            ...(prefixes?.map(prefix => ({
              label: prefix.prefix,
              kind: languages.CompletionItemKind.Variable,
              detail: 'Prefix',
              insertText: prefix.prefix + ':',
              range,
            })) ?? []),
            ...(source?.references
              ? source.references.map(ref => ({
                  label: ref,
                  kind: languages.CompletionItemKind.Class,
                  detail: 'Reference',
                  insertText: '$(' + ref + ')',
                  range,
                }))
              : []),
          ],
        } as languages.CompletionList;
      },
    },
  ]);

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

  const handleTabClick = (tabId: string) => {
    if (selectedTab === tabId && !isCollapsed) {
      setIsCollapsed(true);
      return;
    }
    setSelectedTab(
      tabId as 'properties' | 'ai' | 'references' | 'search' | 'settings',
    );
    setIsCollapsed(false);
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
