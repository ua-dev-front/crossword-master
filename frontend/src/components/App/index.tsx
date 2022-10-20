import React from 'react';
import {
  Mode,
  fillCell,
  eraseCell,
  switchToErasing,
  switchToDrawing,
  switchToEnteringQuestions,
  generateQuestions,
} from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import DrawingOrErasingView from 'views/DrawingOrErasingView';
import Layout from 'components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const { grid, mode, fetchAbortController, apiFailed } = useAppSelector(
    (state) => state,
  );

  const getLoaderLabel = (): string | null => {
    if (fetchAbortController) {
      return mode === Mode.EnterQuestions ? 'Solving...' : 'Generating...';
    }
    if (apiFailed === Mode.Draw) {
      return 'We were unable to generate the questions :(';
    }
    if (apiFailed === Mode.EnterQuestions) {
      return 'We couldn’t solve the crossword :(';
    }

    return null;
  };

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
            onGenerateQuestions={() => dispatch(generateQuestions())}
            onSwitchToEnteringQuestions={() =>
              dispatch(switchToEnteringQuestions())
            }
            loaderLabel={getLoaderLabel()}
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
