import { languages } from 'monaco-editor';

const registerLanguage = (
  monaco: any,
  prefixes: string[],
  refs: string[],
): (() => void) => {
  const languageDef = {
    tokenizer: {
      root: [
        // Regex that will capture the prefixes
        ['[a-zA-Z--]+:', 'prefix'],
        // Regex that will capture the references like $(abcABC) it can use any character/digit and - and _ except ()$
        ['\\$\\([a-zA-Z0-9-_]+\\)', 'ref'],
      ],
    },
  } as languages.IMonarchLanguage;

  monaco?.languages.register({ id: 'mapping' });
  monaco?.languages.setMonarchTokensProvider('mapping', languageDef);
  monaco?.languages.setLanguageConfiguration('mapping', {
    brackets: [['<', '>', 'delimiter.angle']],
  });

  const _dispose = monaco?.languages.registerCompletionItemProvider('mapping', {
    provideCompletionItems: () => {
      return {
        suggestions: [
          ...prefixes.map(
            prefix =>
              ({
                label: prefix,
                kind: languages.CompletionItemKind.Property,
                insertText: `${prefix}`,
                detail: 'Prefix',
              }) as languages.CompletionItem,
          ),
          ...refs.map(
            ref =>
              ({
                label: ref,
                kind: languages.CompletionItemKind.Class,
                insertText: `$(${ref})`,
                detail: 'Reference',
              }) as languages.CompletionItem,
          ),
        ],
      } as languages.CompletionList;
    },
  });

  return _dispose?.dispose ?? (() => {});
};

export default registerLanguage;
