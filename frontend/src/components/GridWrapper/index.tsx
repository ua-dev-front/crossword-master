import React, { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Mode as GlobalMode, State } from 'store';
import Grid, { Props as GridProps } from 'components/Grid';
import Loader from 'components/Loader';
import './styles.scss';

export type Props = {
  gridProps: GridProps;
  children: ReactNode;
  apiFailed: State['apiFailed'];
  fetchAbortController: State['fetchAbortController'];
  mode: GlobalMode;
};

export default function GridWrapper({
  gridProps,
  children,
  apiFailed,
  fetchAbortController,
  mode,
}: Props) {
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
        <div
          className={classnames(
            'grid-wrapper__overlay',
            !showOverlay && 'grid-wrapper__overlay_hidden',
          )}
        >
          <Loader label={loaderLabel} display={showOverlay} />
        </div>
        <Grid {...gridProps} />
      </div>
      {children}
    </div>
  );
}
