import React from 'react';
import { State, AppDispatch, fillCell, switchToErasing } from 'store';
import GridWrapper from 'components/GridWrapper';
import { Mode } from 'components/Grid';
import Tabs from 'components/Tabs';
import DrawOrEraseContent from 'components/DrawOrEraseViewContent';
import getBooleanGrid from 'utils/getBooleanGrid';
import Square from 'icons/Square';

type Props = {
  grid: State['grid'];
  dispatch: AppDispatch;
};

export default function DrawingView({ grid, dispatch }: Props) {
  return (
    <>
      <GridWrapper
        gridProps={{
          mode: Mode.Draw,
          matrix: getBooleanGrid(grid),
          onChange: (row, column) => dispatch(fillCell({ row, column })),
        }}
      >
        <Tabs
          selectedTab={{
            label: 'Drawing',
            icon: <Square isFilled={false} />,
          }}
          secondTab={{
            label: 'Erase',
            onClick: () => dispatch(switchToErasing()),
            icon: <Square isFilled={true} />,
          }}
        />
      </GridWrapper>
      <DrawOrEraseContent grid={grid} />
    </>
  );
}
