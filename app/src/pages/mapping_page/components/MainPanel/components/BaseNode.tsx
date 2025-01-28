import { cn } from '@/utils/cn';
import React from 'react';

import useMappingPage from '@/pages/mapping_page/state';
import './styles.scss';

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => {
  const setSelectedTab = useMappingPage(state => state.setSelectedTab);

  const onClick = React.useCallback(() => {
    setSelectedTab('properties');
  }, [setSelectedTab]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'base-node',
        selected ? 'base-node--selected' : '',
        'base-node--hover',
        className,
      )}
      tabIndex={0}
      {...props}
    />
  );
});
BaseNode.displayName = 'BaseNode';
