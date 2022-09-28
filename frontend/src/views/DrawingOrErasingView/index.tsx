import React, { useMemo } from 'react';
import {
  Mode,
  State,
  AppDispatch,
  fillCell,
  eraseCell,
  switchToDrawing,
  switchToErasing,
} from 'store';
import Button from 'components/Button';
import GridWrapper from 'components/GridWrapper';
import Label, { LabelSize } from 'components/Label';
import { Mode as GridMode } from 'components/Grid';
import Tabs from 'components/Tabs';
import Square from 'icons/Square';
import './styles.scss';

type Props = {
  mode: Mode;
  grid: State['grid'];
  dispatch: AppDispatch;
};

export default function DrawingOrErasingView({ mode, grid, dispatch }: Props) {
  const drawingIcon = <Square isFilled={false} />;
  const erasingIcon = <Square isFilled={true} />;

  const booleanGrid = useMemo(
    () => grid.map((row) => row.map((cell) => !!cell)),
    [grid]
  );

  const isGridEmpty = useMemo(() => {
    return booleanGrid.every((row) => row.every((cell) => !cell));
  }, [booleanGrid]);

  return (
    <>
      <GridWrapper
        gridProps={{
          matrix: booleanGrid,
          mode: mode === Mode.Draw ? GridMode.Draw : GridMode.Erase,
          onChange: (row, column) =>
            dispatch(
              (mode === Mode.Draw ? fillCell : eraseCell)({ row, column })
            ),
        }}
      >
        <Tabs
          {...(mode === Mode.Draw
            ? {
                selectedTab: {
                  label: 'Drawing',
                  icon: drawingIcon,
                },
                secondaryTab: {
                  label: 'Erase',
                  onClick: () => dispatch(switchToErasing()),
                  icon: erasingIcon,
                },
              }
            : {
                selectedTab: {
                  label: 'Erasing',
                  icon: erasingIcon,
                },
                secondaryTab: {
                  label: 'Draw',
                  onClick: () => dispatch(switchToDrawing()),
                  icon: drawingIcon,
                },
              })}
        />
      </GridWrapper>
      {isGridEmpty ? (
        <div className='center'>
          <Label
            content='Let’s draw some squares first!'
            size={LabelSize.Large}
          />
        </div>
      ) : (
        <div className='center option-buttons'>
          <Button
            label='Generate questions'
            onClick={() => console.log('test')}
          />
          <Button
            label='Enter questions & solve'
            onClick={() => console.log('test')}
          />
        </div>
      )}
    </>
  );
}
