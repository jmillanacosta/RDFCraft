import { editor } from 'monaco-editor';

const mapping_theme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  encodedTokensColors: [],
  colors: {},
  rules: [
    { token: 'prefix', foreground: 'FFA500' }, // Orange for prefixes
    { token: 'ref', foreground: 'FF00FF' }, // Purple for references
    { token: 'protocol', foreground: '00FF00' }, // Green for protocols
    { token: 'domain', foreground: 'FF0000' }, // Red for domains
    { token: 'path', foreground: '0000FF' }, // Blue for paths
  ],
};

export default mapping_theme;
