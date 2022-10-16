import React, { ReactNode, useEffect, useState } from 'react';
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
  const { fetchAbortController, apiFailed, mode } = useAppSelector(
    (state) => state.general,
  );
  const showOverlay = !!fetchAbortController || !!apiFailed;
  const [loaderLabel, setLoaderLabel] = useState('');

  const getLoaderLabel = (): string | null => {
    if (fetchAbortController) {
      return mode === GlobalMode.EnterQuestions
        ? 'Solving...'
        : 'Generating...';
    }
    if (apiFailed === GlobalMode.Draw) {
      return 'We were unable to generate the questions :(';
    }
    if (apiFailed === GlobalMode.EnterQuestions) {
      return 'We couldn’t solve the crossword :(';
    }

    return null;
  };

  useEffect(() => {
    setLoaderLabel(getLoaderLabel() ?? loaderLabel);
  }, [fetchAbortController, apiFailed]);

  return (
    <div className='grid-wrapper'>
      <div className='grid-wrapper__grid'>
        <div className='grid-wrapper__overlay'>
          <Loader label={loaderLabel} isLoading={showOverlay} />
        </div>
        <Grid {...gridProps} />
      </div>
      {children}
    </div>
  );
}
