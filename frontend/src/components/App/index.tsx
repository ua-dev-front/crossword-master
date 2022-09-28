import React from 'react';
import {
  Mode,
  fillCell,
  eraseCell,
  switchToErasing,
  switchToDrawing,
} from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import DrawingView from 'views/DrawingView';
import ErasingView from 'views/ErasingView';
import Layout from 'components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.general.mode);
  const grid = useAppSelector((state) => state.general.grid);
  const viewByMode = {
    [Mode.Draw]: (
      <DrawingView
        grid={grid}
        onModeChange={() => dispatch(switchToErasing())}
        onCellChange={(row, column) => dispatch(fillCell({ row, column }))}
      />
    ),
    [Mode.Erase]: (
      <ErasingView
        grid={grid}
        onModeChange={() => dispatch(switchToDrawing())}
        onCellChange={(row, column) => dispatch(eraseCell({ row, column }))}
      />
    ),
    [Mode.EnterQuestions]: <></>,
    [Mode.Answer]: <></>,
    [Mode.Puzzle]: <></>,
  };

  const currentView = viewByMode[mode];

  return <Layout title='Crossword Generator & Solver'>{currentView}</Layout>;
}

export default App;
