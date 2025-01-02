import { useNavigate, useParams } from 'react-router-dom';

import useErrorToast from '@/hooks/useErrorToast';
import useClassTreeNodes from '@/pages/ontology_page/hooks/useClassTreeNodes';
import useIndividualTreeNodes from '@/pages/ontology_page/hooks/useIndividualTreeNodes';
import usePropertyTreeNodes from '@/pages/ontology_page/hooks/usePropertyTreeNodes';
import useOntologyPage from '@/pages/ontology_page/state';
import {
  Button,
  Card,
  Navbar,
  NonIdealState,
  Tab,
  TabPanel,
  Tabs,
  Tree,
  TreeNodeInfo,
} from '@blueprintjs/core';
import { useCallback, useEffect, useId, useState } from 'react';
import './styles.scss';

type OntologyPageTab = 'classes' | 'properties' | 'individuals';

type OntologyPageURLProps = {
  uuid: string;
  ontology_uuid: string;
};

const OntologyPage = () => {
  const { uuid, ontology_uuid } = useParams<OntologyPageURLProps>();
  const TABS_PARENT_ID = useId();
  const ontology = useOntologyPage(state => state.ontology);
  const isLoading = useOntologyPage(state => state.isLoading);
  const error = useOntologyPage(state => state.error);
  const getOntology = useOntologyPage(state => state.getOntology);
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState<OntologyPageTab>('classes');
  const [contents, setContents] = useState<TreeNodeInfo[]>([]);
  useErrorToast(error);

  useEffect(() => {
    if (uuid && ontology_uuid) {
      getOntology(uuid, ontology_uuid);
    }
  }, [uuid, ontology_uuid, getOntology]);

  const classTreeNodes = useClassTreeNodes(ontology);
  const propertyTreeNodes = usePropertyTreeNodes(ontology);
  const individualTreeNodes = useIndividualTreeNodes(ontology);

  const switchTab = useCallback(
    (tab: OntologyPageTab) => {
      setSelectedTab(tab);
      switch (tab) {
        case 'classes':
          setContents(classTreeNodes);
          break;
        case 'properties':
          setContents(propertyTreeNodes);
          break;
        case 'individuals':
          setContents(individualTreeNodes);
          break;
      }
    },
    [setSelectedTab, classTreeNodes, propertyTreeNodes, individualTreeNodes],
  );

  useEffect(() => {
    setContents(classTreeNodes);

    return () => {
      setContents([]);
    };
  }, [classTreeNodes]);

  const onExpand = useCallback((node: TreeNodeInfo, nodePath: number[]) => {
    setContents(state => {
      const newContents = [...state];
      let currentNode = newContents[nodePath[0]];
      for (let i = 1; i < nodePath.length; i++) {
        if (!currentNode.childNodes) {
          throw new Error('Node does not have children');
        }
        currentNode = currentNode.childNodes[nodePath[i]];
      }
      console.log(`${currentNode.id} Expanded`);
      currentNode.isExpanded = true;
      return newContents;
    });
  }, []);

  const onCollapse = useCallback((node: TreeNodeInfo, nodePath: number[]) => {
    setContents(state => {
      const newContents = [...state];
      let currentNode = newContents[nodePath[0]];
      for (let i = 1; i < nodePath.length; i++) {
        if (!currentNode.childNodes) {
          throw new Error('Node does not have children');
        }
        currentNode = currentNode.childNodes[nodePath[i]];
      }
      console.log(`${currentNode.id} Collapsed`);
      currentNode.isExpanded = false;
      return newContents;
    });
  }, []);

  return (
    <div className='ontology-page'>
      <Navbar fixedToTop>
        <Navbar.Group>
          <Button
            icon='arrow-left'
            minimal
            onClick={() => {
              navigation(`/workspaces/${uuid}/ontologies`);
            }}
          />
          <div style={{ width: 10 }} />
          <Navbar.Heading>{ontology?.name ?? ''}</Navbar.Heading>
          <Navbar.Divider />
          <Navbar.Heading>
            {isLoading ? <>{isLoading}...</> : null}
          </Navbar.Heading>
        </Navbar.Group>
      </Navbar>
      <div className='ontology-page-content'>
        <Card className='ontology-page-card'>
          <Tabs
            id={TABS_PARENT_ID}
            className='ontology-page-tabs'
            selectedTabId={selectedTab}
            onChange={switchTab}
          >
            <Tab id='classes' title='Classes' />
            <Tab id='properties' title='Properties' />
            <Tab id='individuals' title='Individuals' />
          </Tabs>
          <TabPanel
            id={selectedTab}
            selectedTabId={selectedTab}
            parentId={TABS_PARENT_ID}
            className='ontology-page-tab-panel'
            panel={
              contents.length !== 0 ? (
                <Tree
                  contents={contents}
                  onNodeExpand={onExpand}
                  onNodeCollapse={onCollapse}
                />
              ) : (
                <NonIdealState
                  icon='search'
                  title='No Data'
                  description='No data available for this tab'
                />
              )
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default OntologyPage;
