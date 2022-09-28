import React from 'react';
import { Mode } from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import DrawingOrErasingView from 'views/drawingOrErasingView';
import Layout from 'components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.general.mode);
  const grid = useAppSelector((state) => state.general.grid);

  const viewByMode = {
    ...[Mode.Draw, Mode.Erase].reduce((acc, currentMode) => {
      acc[currentMode] = (
        <DrawingOrErasingView
          mode={currentMode}
          grid={grid}
          dispatch={dispatch}
        />
      );
      return acc;
    }, {} as Record<Mode, JSX.Element>),
    [Mode.EnterQuestions]: <></>,
    [Mode.Answer]: <></>,
    [Mode.Puzzle]: <></>,
  };

  const currentView = viewByMode[mode];

  return <Layout title='Crossword Generator & Solver'>{currentView}</Layout>;
}

export default App;
