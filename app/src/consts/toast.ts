import { OverlayToaster } from '@blueprintjs/core';
import { createRoot } from 'react-dom/client';

const toast = await OverlayToaster.createAsync(
  {
    position: 'top',
  },
  {
    domRenderer: (toaster, containerElement) =>
      createRoot(containerElement).render(toaster),
  },
);

export default toast;
