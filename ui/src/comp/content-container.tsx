import React from 'react';
import { Grid } from '@mui/material';

export const ContentContainer: React.FC<{
  children: React.ReactNode,
} & Parameters<typeof Grid>[0]> = ({
  children,
  ...rest
}) => (
  <Grid container
    direction="column"
    spacing={2}
    columns={1}
    sx={{
      width: 'calc(50vw - 20px)',
      alignItems: 'stretch',
      justifyItems: 'stretch',
    }}
    {...rest}
  >
    {children}
  </Grid>
)
