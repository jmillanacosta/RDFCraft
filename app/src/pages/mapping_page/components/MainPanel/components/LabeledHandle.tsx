import { BaseHandle } from '@/pages/mapping_page/components/MainPanel/components/BaseHandle';
import { HandleProps, Position } from '@xyflow/react';
import React from 'react';

const LabeledHandle = React.forwardRef<
  HTMLDivElement,
  Omit<HandleProps, 'position'> &
    React.HTMLAttributes<HTMLDivElement> & {
      title: string;
      bigTitle?: boolean;
      handleClassName?: string;
      labelClassName?: string;
    }
>(({ className, labelClassName, title, bigTitle, ...props }, ref) => (
  <div
    ref={ref}
    title={title}
    className={className}
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <BaseHandle position={Position.Left} {...props} />
    {bigTitle ? (
      <h2
        style={{ padding: '0 0.75rem', color: 'var(--foreground)' }}
        className={labelClassName}
      >
        {title}
      </h2>
    ) : (
      <label
        style={{
          padding: '0 0.75rem',
          color: 'var(--foreground)',
          width: '100%',
        }}
        className={labelClassName}
      >
        {title}
      </label>
    )}
  </div>
));

LabeledHandle.displayName = 'LabeledHandle';

export { LabeledHandle };
