import { useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useEffect } from 'react';

const useRegisterTheme = (
  themeName: string,
  themeData: editor.IStandaloneThemeData,
) => {
  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme(themeName, themeData);
    }
  }, [monaco, themeName, themeData]);
};

export default useRegisterTheme;
