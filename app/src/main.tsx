import { BlueprintProvider } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.scss';

import ApiService from './lib/services/api_service';
import WorkspacesPage from './pages/workspaces_page';

// If development mode is enabled

if (import.meta.env.MODE === 'development') {
  // Enable React strict mode
  ApiService.registerWithNamespace('default', 'http://localhost:8000/api/');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <WorkspacesPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlueprintProvider>
      <div className='bp5-dark'>
        <RouterProvider router={router} />
      </div>
    </BlueprintProvider>
  </StrictMode>,
);
