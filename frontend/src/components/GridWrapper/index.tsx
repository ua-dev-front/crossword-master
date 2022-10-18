import React, { ReactNode, useLayoutEffect, useState } from 'react';
import classnames from 'classnames';
import Grid, { Props as GridProps } from 'components/Grid';
import Loader from 'components/Loader';
import './styles.scss';

export type Props = {
  gridProps: GridProps;
  children: ReactNode;
  loaderLabel: string | null;
};

export default function GridWrapper({
  gridProps,
  children,
  loaderLabel,
}: Props) {
  const [currentLoaderLabel, setCurrentLoaderLabel] = useState('');
  useLayoutEffect(() => {
    setCurrentLoaderLabel(loaderLabel ?? currentLoaderLabel);
  }, [loaderLabel]);

  return (
    <div className='grid-wrapper'>
      <div className='grid-wrapper__grid'>
        <div
          className={classnames(
            'grid-wrapper__overlay',
            !loaderLabel && 'grid-wrapper__overlay_hidden',
          )}
        >
          <Loader label={currentLoaderLabel} display={!!loaderLabel} />
        </div>
        <Grid {...gridProps} />
      </div>
      {children}
    </div>
  );
}
