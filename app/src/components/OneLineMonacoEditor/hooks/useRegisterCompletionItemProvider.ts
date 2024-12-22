import { useMonaco } from '@monaco-editor/react';
import { languages } from 'monaco-editor';
import { useEffect } from 'react';

const useRegisterCompletionItemProvider = (
  languageId: string,
  completionItemProviders: languages.CompletionItemProvider[],
) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    if (
      monaco.languages
        .getLanguages()
        .findIndex(lang => lang.id === languageId) === -1
    ) {
      return;
    }

    const disposers = completionItemProviders.map(provider => {
      return monaco.languages.registerCompletionItemProvider(
        languageId,
        provider,
      );
    });

    return () => {
      disposers.forEach(dispose => dispose.dispose());
    };
  }, [monaco, languageId, completionItemProviders]);

  return;
};

export default useRegisterCompletionItemProvider;
