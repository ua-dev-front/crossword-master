import React from 'react';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { Mode } from 'store';
import DrawingView from 'views/DrawingView';
import ErasingView from 'views/ErasingView';
import Layout from 'components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.general.mode);
  const grid = useAppSelector((state) => state.general.grid);

  const viewByMode = {
    [Mode.Draw]: <DrawingView grid={grid} dispatch={dispatch} />,
    [Mode.Erase]: <ErasingView grid={grid} dispatch={dispatch} />,
    [Mode.EnterQuestions]: <></>,
    [Mode.Answer]: <></>,
    [Mode.Puzzle]: <></>,
  };

  const CurrentView = viewByMode[mode];

  return <Layout title='Crossword Generator & Solver'>{CurrentView}</Layout>;
}

export default App;
