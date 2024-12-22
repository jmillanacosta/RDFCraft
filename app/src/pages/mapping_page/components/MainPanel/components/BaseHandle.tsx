import { cn } from '@/utils/cn';
import { Handle, HandleProps } from '@xyflow/react';
import React from 'react';

export const BaseHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & HandleProps
>(({ className, ...props }, ref) => (
  <Handle
    style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 0,
      transform: 'none',
      border: 'none',
      opacity: 0,
    }}
    ref={ref}
    className={cn('', className)}
    {...props}
  />
));
BaseHandle.displayName = 'BaseHandle';
