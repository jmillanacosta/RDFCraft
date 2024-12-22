import { languages } from 'monaco-editor';

export const mapping_language: languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      // Regex that will capture the prefixes like a: ex: etc
      ['[a-zA-Z0-9-_]+:', 'prefix'],
      // Regex that will capture the references like $(abcABC) it can use any character/digit and - and _ except ()$
      ['\\$\\([a-zA-Z0-9-_]+\\)', 'ref'],
    ],
  },
};
