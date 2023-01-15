import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';

export const ContentContainer: React.FC<{
  children: React.ReactNode,
} & Parameters<typeof Grid>[0]> = ({
  children,
  ...rest
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const columnWidth = isMobile ? '90vw' : '50vw'

  return (
    <Grid container
      direction="column"
      spacing={2}
      columns={1}
      sx={{
        width: `calc(${columnWidth} - 20px)`,
        alignItems: 'stretch',
        justifyItems: 'stretch',
      }}
      {...rest}
    >
      {children}
    </Grid>
  )
}
