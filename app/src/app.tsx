import { BlueprintProvider } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WorkspacesPage from './pages/workspaces_page';

import './index.scss';
import MappingPage from './pages/mapping_page';
import OntologiesPage from './pages/ontologies_page';
import PrefixPage from './pages/prefixes_page';
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
  {
    path: '/workspaces/:uuid/ontologies',
    element: <OntologiesPage />,
  },
  {
    path: '/workspaces/:uuid/prefixes',
    element: <PrefixPage />,
  },
  {
    path: '/workspaces/:uuid/mapping/:mapping_uuid',
    element: <MappingPage />,
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
