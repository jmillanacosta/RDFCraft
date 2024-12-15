import { createRoot } from 'react-dom/client';

import './index.scss';

import React from 'react';
import App from './app';
import ApiService from './lib/services/api_service';

ApiService.registerWithNamespace('default', 'http://localhost:8000/api/');

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
