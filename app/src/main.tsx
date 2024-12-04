import { createRoot } from 'react-dom/client';

import './index.scss';

import App from './app';
import ApiService from './lib/services/api_service';

ApiService.registerWithNamespace('default', 'http://localhost:8000/api/');

createRoot(document.getElementById('root')!).render(<App />);
