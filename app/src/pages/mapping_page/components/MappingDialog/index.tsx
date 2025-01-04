import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Tab,
  TabPanel,
  Tabs,
} from '@blueprintjs/core';
import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

type MappingDialogProps = {
  open: boolean;
  yarrrml: string;
  rml: string;
  ttl: string;
  onClose: () => void;
};

const MappingDialog = ({
  open,
  yarrrml,
  rml,
  ttl,
  onClose,
}: MappingDialogProps) => {
  const [activeTab, setActiveTab] = useState('yarrrml');

  return (
    <Dialog
      className='bp5-dark'
      isOpen={open}
      onClose={onClose}
      title='Mapping'
      style={{ width: '80vw', height: '80vh' }}
    >
      <DialogBody>
        <Tabs
          id='Tabs'
          onChange={newTabId => setActiveTab(String(newTabId))}
          selectedTabId={activeTab}
        >
          <Tab
            id='yarrrml'
            title='YARRRML'
            panel={
              <Editor
                height='60vh'
                theme='vs-dark'
                defaultLanguage='yaml'
                defaultValue={yarrrml}
                options={{
                  readOnly: true,
                }}
              />
            }
          />
          <Tab
            id='rml'
            title='RML'
            panel={
              <Editor
                height='60vh'
                theme='vs-dark'
                defaultLanguage='yaml'
                defaultValue={rml}
                options={{ readOnly: true }}
              />
            }
          />
          <Tab
            id='ttl'
            title='TTL'
            panel={
              <Editor
                height='60vh'
                theme='vs-dark'
                defaultLanguage='turtle'
                defaultValue={ttl}
                options={{ readOnly: true }}
              />
            }
          />
        </Tabs>
        <TabPanel id='yarrrml' parentId='Tabs' selectedTabId={activeTab} />
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default MappingDialog;
