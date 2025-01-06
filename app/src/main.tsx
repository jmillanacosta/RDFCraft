import { createRoot } from 'react-dom/client';

import './index.scss';

import React from 'react';
import App from './app';
import ApiService from './lib/services/api_service';

// If environment is development, register the default namespace with the local API server

if (process.env.NODE_ENV === 'development') {
  ApiService.registerWithNamespace('default', 'http://localhost:8000/api/');
}

// else use the default namespace with the production API server
else {
  ApiService.registerWithNamespace('default', '/api/');
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
