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
import DrawingOrErasingView from 'views/DrawingOrErasingView';
import Layout from 'components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.mode);
  const grid = useAppSelector((state) => state.grid);

  const getCurrentView = () => {
    switch (mode) {
      case Mode.Draw:
      case Mode.Erase:
        return (
          <DrawingOrErasingView
            mode={mode}
            grid={grid}
            onModeChange={() =>
              dispatch(
                (mode === Mode.Draw ? switchToErasing : switchToDrawing)(),
              )
            }
            onCellChange={(row, column) =>
              dispatch(
                (mode === Mode.Draw ? fillCell : eraseCell)({ row, column }),
              )
            }
          />
        );
      case Mode.EnterQuestions:
        return <></>;
      case Mode.Answer:
        return <></>;
      case Mode.Puzzle:
        return <></>;
    }
  };

  return (
    <Layout title='Crossword Generator & Solver'>{getCurrentView()}</Layout>
  );
}

export default App;
