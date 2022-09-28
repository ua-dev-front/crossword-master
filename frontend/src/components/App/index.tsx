import React from 'react';
import { Mode } from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import DrawingOrErasingView from 'views/DrawingOrErasingView';
import Layout from 'components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.general.mode);
  const grid = useAppSelector((state) => state.general.grid);

  const getDrawingOrErasingView = () => (
    <DrawingOrErasingView mode={mode} grid={grid} dispatch={dispatch} />
  );

  const viewByMode = {
    [Mode.Draw]: getDrawingOrErasingView(),
    [Mode.Erase]: getDrawingOrErasingView(),
    [Mode.EnterQuestions]: <></>,
    [Mode.Answer]: <></>,
    [Mode.Puzzle]: <></>,
  };

  const currentView = viewByMode[mode];

  return <Layout title='Crossword Generator & Solver'>{currentView}</Layout>;
}

export default App;
