import React, { useMemo } from 'react';
import classnames from 'classnames';
import {
  Mode,
  fillCell,
  eraseCell,
  switchToErasing,
  switchToDrawing,
  switchToEnteringQuestions,
  editCrosswordAndAbortFetch,
  generateQuestions,
  switchToAnswer,
  switchToPuzzle,
} from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { Mode as GridMode, Props as GridProps } from 'components/Grid';
import Button from 'components/Button';
import GridWrapper from 'components/GridWrapper';
import Label, { LabelSize } from 'components/Label';
import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import Square from 'icons/Square';
import './styles.scss';

function App() {
  const dispatch = useAppDispatch();
  const { grid, mode, fetchAbortController, apiFailed } = useAppSelector(
    (state) => state,
  );

  const getTabByModeAndIsSelected = (
    currentMode: Mode.Answer | Mode.Draw | Mode.Erase | Mode.Puzzle,
    isSelected: boolean,
  ) => {
    const getLabel = (
      labelMode: Mode.Answer | Mode.Draw | Mode.Erase | Mode.Puzzle,
    ) => {
      const labelByModeAndIsSelected = {
        [Mode.Draw]: {
          regular: 'Draw',
          selected: 'Drawing',
        },
        [Mode.Erase]: {
          regular: 'Erase',
          selected: 'Erasing',
        },
        [Mode.Puzzle]: {
          regular: 'Puzzle',
          selected: 'Puzzle',
        },
        [Mode.Answer]: {
          regular: 'Answer',
          selected: 'Answer',
        },
      };

      return labelByModeAndIsSelected[labelMode][
        isSelected ? 'selected' : 'regular'
      ];
    };

    return {
      label: getLabel(currentMode),
      alternativeLabel: getLabel(
        currentMode === Mode.Draw ? Mode.Erase : Mode.Draw,
      ),
      icon: (
        <Square
          isFilled={currentMode === Mode.Erase}
          content={currentMode === Mode.Answer ? 'A' : undefined}
        />
      ),
      hide: !!fetchAbortController,
    };
  };

  const booleanGrid = useMemo(
    () => grid.map((row) => row.map((cell) => !!cell)),
    [grid],
  );
  const puzzleGrid = useMemo(
    () =>
      grid.map((row) =>
        row.map((cell) => (cell ? { number: cell.number } : null)),
      ),
    [grid],
  );

  const isGridEmpty = useMemo(() => {
    return booleanGrid.every((row) => row.every((cell) => !cell));
  }, [booleanGrid]);

  const isDrawOrEraseMode = mode === Mode.Draw || mode === Mode.Erase;
  const isAnswerOrPuzzleMode = mode === Mode.Puzzle || mode === Mode.Answer;

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

  const getGridProps = (): GridProps => {
    switch (mode) {
      case Mode.Draw:
      case Mode.Erase:
        return {
          matrix: booleanGrid,
          mode: mode === Mode.Draw ? GridMode.Draw : GridMode.Erase,
          onChange: (row, column) =>
            dispatch(
              (mode === Mode.Draw ? fillCell : eraseCell)({
                row,
                column,
              }),
            ),
        };
      case Mode.EnterQuestions:
      case Mode.Puzzle:
        return {
          matrix: puzzleGrid,
          mode: GridMode.Puzzle,
        };
      case Mode.Answer:
        return {
          matrix: grid as { letter: string; number: number | null }[][],
          mode: GridMode.Answer,
        };
    }
  };

  return (
    <Layout title='Crossword Generator & Solver'>
      <GridWrapper gridProps={getGridProps()} loaderLabel={getLoaderLabel()}>
        <Tabs
          onEditClick={
            fetchAbortController || isAnswerOrPuzzleMode
              ? () => dispatch(editCrosswordAndAbortFetch())
              : undefined
          }
          {...(isDrawOrEraseMode && {
            selectedTab: getTabByModeAndIsSelected(mode, true),
            secondaryTab: {
              ...getTabByModeAndIsSelected(
                mode === Mode.Draw ? Mode.Erase : Mode.Draw,
                false,
              ),
              onClick: () =>
                dispatch(
                  (mode === Mode.Draw ? switchToErasing : switchToDrawing)(),
                ),
            },
          })}
          {...(isAnswerOrPuzzleMode && {
            selectedTab: getTabByModeAndIsSelected(mode, true),
            secondaryTab: {
              ...getTabByModeAndIsSelected(
                mode === Mode.Answer ? Mode.Puzzle : Mode.Answer,
                false,
              ),
              onClick: () =>
                dispatch(
                  (mode === Mode.Answer ? switchToPuzzle : switchToAnswer)(),
                ),
            },
          })}
        />
      </GridWrapper>
      <div className='app__option-button-wrapper'>
        <div
          className={classnames(
            'app__option-button-wrapper-item',
            (!isDrawOrEraseMode || fetchAbortController || !isGridEmpty) &&
              'app__option-button-wrapper-item_hidden',
          )}
        >
          <Label
            content='Let’s draw some squares first!'
            size={LabelSize.Large}
          />
        </div>
        <div
          className={classnames(
            'app__option-button-wrapper-item',
            (!isDrawOrEraseMode || fetchAbortController || isGridEmpty) &&
              'app__option-button-wrapper-item_hidden',
            'app__option-button-wrapper-buttons',
          )}
        >
          <Button
            label='Generate questions'
            onClick={() => dispatch(generateQuestions())}
          />
          <Button
            label='Enter questions & solve'
            onClick={() => dispatch(switchToEnteringQuestions())}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
