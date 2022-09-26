import React from 'react';
import { State, AppDispatch, eraseCell, switchToDrawing } from 'store';
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

export default function ErasingView({ grid, dispatch }: Props) {
  return (
    <>
      <GridWrapper
        gridProps={{
          mode: Mode.Erase,
          matrix: getBooleanGrid(grid),
          onChange: (row, column) => dispatch(eraseCell({ row, column })),
        }}
      >
        <Tabs
          selectedTab={{
            label: 'Erasing',
            icon: <Square isFilled={true} />,
          }}
          secondTab={{
            label: 'Draw',
            onClick: () => dispatch(switchToDrawing()),
            icon: <Square isFilled={false} />,
          }}
        />
      </GridWrapper>
      <DrawOrEraseContent grid={grid} />
    </>
  );
}
