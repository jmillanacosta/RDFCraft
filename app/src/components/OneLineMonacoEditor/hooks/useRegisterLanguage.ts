import { useMonaco } from '@monaco-editor/react';
import { languages } from 'monaco-editor';

const useRegisterLanguage = (
  languageId: string,
  languageDef: languages.IMonarchLanguage,
  languageConfiguration: languages.LanguageConfiguration,
) => {
  const monaco = useMonaco();

  if (!monaco) return;

  if (
    monaco.languages
      .getLanguages()
      .findIndex(lang => lang.id === languageId) !== -1
  ) {
    return;
  }

  monaco.languages.register({ id: languageId });
  monaco.languages.setMonarchTokensProvider(languageId, languageDef);
  monaco.languages.setLanguageConfiguration(languageId, languageConfiguration);

  return languageId;
};

export default useRegisterLanguage;
