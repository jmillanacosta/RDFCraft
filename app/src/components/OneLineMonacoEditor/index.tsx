'use client';

import { Editor } from '@monaco-editor/react';
import { IKeyboardEvent, editor } from 'monaco-editor';

import { useRef } from 'react';

const OneLineMonaco = ({
  value,
  language = 'mapping',
  onChange,
  disabled,
  ...rest
}: {
  value: string;
  language?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  [key: string]: unknown;
}) => {
  const editorRef = useRef<editor.ICodeEditor | null>(null);

  const onEnter = (e: IKeyboardEvent) => {
    if (editorRef.current === null) return;
    // Write a code that prevents new lines
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
    }
  };

  function handleEditorDidMount(editor: editor.ICodeEditor) {
    editorRef.current = editor;

    editor.onKeyDown(onEnter);
    // Now you can use the instance of monaco editor
    // in this component whenever you want
  }

  // Prevent new lines

  return (
    <Editor
      language={language}
      theme='vs-dark'
      value={disabled ? '' : value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      loading={''}
      height='23px'
      width='100%'
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
        fixedOverflowWidgets: true,
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
  );
};

export default OneLineMonaco;
