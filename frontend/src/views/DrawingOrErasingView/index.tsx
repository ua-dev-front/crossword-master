import React, { useMemo } from 'react';
import { Mode, State } from 'store';
import Button from 'components/Button';
import GridWrapper from 'components/GridWrapper';
import Label, { LabelSize } from 'components/Label';
import { Mode as GridMode } from 'components/Grid';
import Tabs from 'components/Tabs';
import Square from 'icons/Square';
import './styles.scss';

export enum TabLabels {
  Draw = 'Draw',
  Erase = 'Erase',
  Drawing = 'Drawing',
  Erasing = 'Erasing',
}

export type Props = {
  mode: Mode;
  grid: State['grid'];
  onModeChange: () => void;
  onCellChange: (row: number, column: number) => void;
};

export default function DrawingOrErasingView({
  mode,
  grid,
  onModeChange,
  onCellChange,
}: Props) {
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
          onChange: (row, column) => onCellChange(row, column),
        }}
      >
        <Tabs
          {...(mode === Mode.Draw
            ? {
                selectedTab: {
                  label: TabLabels.Drawing,
                  icon: drawingIcon,
                  alternativeLabel: TabLabels.Erasing,
                },
                secondaryTab: {
                  label: TabLabels.Erase,
                  onClick: () => onModeChange(),
                  icon: erasingIcon,
                  alternativeLabel: TabLabels.Draw,
                },
              }
            : {
                selectedTab: {
                  label: TabLabels.Erasing,
                  icon: erasingIcon,
                  alternativeLabel: TabLabels.Drawing,
                },
                secondaryTab: {
                  label: TabLabels.Draw,
                  onClick: () => onModeChange(),
                  icon: drawingIcon,
                  alternativeLabel: TabLabels.Erase,
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
