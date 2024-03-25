'use client';

import { Editor } from '@monaco-editor/react';
import { FormLabel } from '@mui/material';
import { IKeyboardEvent, editor } from 'monaco-editor';

import { useRef } from 'react';

const OneLineMonaco = ({
  value,
  onChange,
  disabled,
  ...rest
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const editorRef = useRef<editor.IEditor | null>(null);

  const onEnter = (e: IKeyboardEvent) => {
    if (editorRef.current === null) return;
    // Write a code that prevents new lines
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
    }
  };

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;

    editor.onKeyDown(onEnter);
    // Now you can use the instance of monaco editor
    // in this component whenever you want
  }

  // Prevent new lines

  return (
    <>
      <FormLabel>URI</FormLabel>
      <Editor
        language='mapping'
        theme='default'
        value={disabled ? '' : value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        height={30}
        className='nodrag noscroll'
        options={{
          lineDecorationsWidth: 0,
          glyphMargin: false,
          lineNumbers: 'off',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          readOnly: disabled || false,
          minimap: {
            enabled: false,
          },
          lineNumbersMinChars: 0,
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollBeyondLastColumn: 0,
          folding: false,
          scrollbar: {
            horizontal: 'hidden',
            vertical: 'hidden',
            // avoid can not scroll page when hover monaco
            alwaysConsumeMouseWheel: false,
          },
          fontFamily: 'monospace',
          fontSize: 15,
        }}
        {...rest}
      />
    </>
  );
};

export default OneLineMonaco;
