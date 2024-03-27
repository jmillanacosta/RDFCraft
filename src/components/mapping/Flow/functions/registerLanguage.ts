import { OntologyIndividualModel } from '@/lib/models/OntologyIndexModel';
import { languages } from 'monaco-editor';

const registerLanguage = (
  monaco: any,
  prefixes: string[],
  refs: string[],
  extTerminologies: OntologyIndividualModel[],
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

  // const extTerminologiesLanguageDef = {
  //   tokenizer: {
  //     root: [
  //       // Regex that will capture the protocols
  //       ['^(http|https):\\/\\/', 'protocol'],
  //       // Capture domain
  //       ['(?<=:\\/\\/)([^\\/]+)', 'domain'],
  //       // Capture path
  //       ['\\/([^?#]*),', 'path'],
  //     ],
  //   },
  // } as languages.IMonarchLanguage;

  monaco?.languages.register({ id: 'mapping' });
  monaco?.languages.setMonarchTokensProvider('mapping', languageDef);
  monaco?.languages.setLanguageConfiguration('mapping', {
    brackets: [['<', '>', 'delimiter.angle']],
  });

  monaco?.languages.register({ id: 'extTerminologies' });
  monaco?.languages.setMonarchTokensProvider('extTerminologies', languageDef);

  const _dispose1 = monaco?.languages.registerCompletionItemProvider(
    'mapping',
    {
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
    },
  );

  const _dispose2 = monaco?.languages.registerCompletionItemProvider(
    'extTerminologies',
    {
      provideCompletionItems: () => {
        return {
          suggestions: [
            ...extTerminologies.map(
              extTerminology =>
                ({
                  label: extTerminology.label,
                  kind: languages.CompletionItemKind.Class,
                  insertText: `${extTerminology.full_uri}`,
                  detail: extTerminology.description,
                }) as languages.CompletionItem,
            ),
          ],
        } as languages.CompletionList;
      },
    },
  );

  const _dispose = {
    dispose: () => {
      _dispose1?.dispose();
      _dispose2?.dispose();
    },
  };

  return _dispose?.dispose ?? (() => {});
};

export default registerLanguage;
