import { cn } from '@/utils/cn';
import React from 'react';

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'base-node',
      selected ? 'base-node--selected' : '',
      'base-node--hover',
      className,
    )}
    tabIndex={0}
    {...props}
  />
));
BaseNode.displayName = 'BaseNode';
