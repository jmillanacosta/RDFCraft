'use client';

import { Card, CardActions, CardContent, Typography } from '@mui/material';

export function ItemCard({
  name,
  description,
  secondaryDescription,
  actionsAlignment = 'flex-end',
  children,
}: {
  name: string;
  description?: string;
  secondaryDescription?: string;
  actionsAlignment?: 'flex-start' | 'center' | 'flex-end';
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant='h5' component='h2'>
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary' variant='body2'>
          {description}
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          {secondaryDescription}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: actionsAlignment }}>
        {children}
      </CardActions>
    </Card>
  );
}
