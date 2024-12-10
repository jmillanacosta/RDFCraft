import { BlueprintProvider } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WorkspacesPage from './pages/workspaces_page';

import './index.scss';
import WorkspacePage from './pages/workspace_page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WorkspacesPage />,
  },
  {
    path: '/workspaces/:uuid',
    element: <WorkspacePage />,
  },
]);

const App = () => {
  return (
    <StrictMode>
      <BlueprintProvider>
        <div className='bp5-dark'>
          <RouterProvider router={router} />
        </div>
      </BlueprintProvider>
    </StrictMode>
  );
};

export default App;
