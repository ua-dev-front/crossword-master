import React, { ReactNode } from 'react';
import Grid, { Props as GridProps } from 'components/Grid';

export type Props = {
  gridProps: GridProps;
  children: ReactNode;
};

export default function GridWrapper({ gridProps, children }: Props) {
  return (
    <div className='grid-wrapper'>
      <Grid {...gridProps} />
      {children}
    </div>
  );
}
