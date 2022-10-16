import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Mode as GlobalMode } from 'store';
import useAppSelector from 'hooks/useAppSelector';
import Grid, { Props as GridProps } from 'components/Grid';
import Loader from 'components/Loader';
import './styles.scss';

export type Props = {
  gridProps: GridProps;
  children: ReactNode;
};

export default function GridWrapper({ gridProps, children }: Props) {
  const { fetchAbortController, apiFailed } = useAppSelector(
    (state) => state.general,
  );
  const showOverlay = !!fetchAbortController || !!apiFailed;

  const getLoaderLabel = (): string => {
    if (fetchAbortController) {
      return 'Solving...';
    }
    if (apiFailed === GlobalMode.Draw) {
      return 'We were unable to generate the questions :(';
    }
    if (apiFailed === GlobalMode.EnterQuestions) {
      return 'We couldn’t solve the crossword :(';
    }
    return '';
  };

  return (
    <div className='grid-wrapper'>
      <div className='grid-wrapper__grid'>
        <div
          className={classnames(
            'grid-wrapper__overlay',
            showOverlay && 'grid-wrapper__overlay_visible',
          )}
        >
          <Loader label={getLoaderLabel()} isLoading={showOverlay} />
        </div>
        <Grid {...gridProps} />
      </div>
      {children}
    </div>
  );
}
