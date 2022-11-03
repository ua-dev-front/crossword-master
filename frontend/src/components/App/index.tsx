import React, { useMemo } from 'react';
import {
  Direction,
  Mode,
  fillCell,
  eraseCell,
  switchToErasing,
  switchToDrawing,
  switchToEnteringQuestions,
  editCrosswordAndAbortFetch,
  updateQuestion,
  generateQuestions,
  solveQuestions,
  switchToAnswer,
  switchToPuzzle,
  editQuestionsAndAbortFetch,
  RequestMode,
} from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { Mode as GridMode, Props as GridProps } from 'components/Grid';
import Button from 'components/Button';
import GridWrapper from 'components/GridWrapper';
import Label, { LabelSize } from 'components/Label';
import Layout from 'components/Layout';
import QuestionPanel, { QuestionPanelColor } from 'components/QuestionPanel';
import Tabs, { TabProps } from 'components/Tabs';
import TransitionContainer from 'components/TransitionContainer';
import Square from 'icons/Square';
import './styles.scss';

export type TabMode = Mode.Answer | Mode.Draw | Mode.Erase | Mode.Puzzle;

function App() {
  const dispatch = useAppDispatch();
  const {
    grid,
    mode,
    questions,
    fetchAbortController,
    requestMode,
    requestFailed,
  } = useAppSelector((state) => state);

  const modeToTabMapping: {
    [mode in TabMode]: {
      otherMode: TabMode;
      label: {
        regular: string;
        selected: string;
      };
      onClick: CallableFunction;
    };
  } = {
    [Mode.Draw]: {
      otherMode: Mode.Erase,
      label: {
        regular: 'Draw',
        selected: 'Drawing',
      },
      onClick: switchToDrawing,
    },
    [Mode.Erase]: {
      otherMode: Mode.Draw,
      label: {
        regular: 'Erase',
        selected: 'Erasing',
      },
      onClick: switchToErasing,
    },
    [Mode.Answer]: {
      otherMode: Mode.Puzzle,
      label: {
        regular: 'Answer',
        selected: 'Answer',
      },
      onClick: switchToAnswer,
    },
    [Mode.Puzzle]: {
      otherMode: Mode.Answer,
      label: {
        regular: 'Puzzle',
        selected: 'Puzzle',
      },
      onClick: switchToPuzzle,
    },
  };

  const getTabByModeAndIsSelected = (
    currentMode: TabMode,
    isSelected: boolean,
  ): TabProps => {
    const getLabel = (labelMode: TabMode): string =>
      modeToTabMapping[labelMode].label[isSelected ? 'selected' : 'regular'];

    return {
      label: getLabel(currentMode),
      alternativeLabels: Object.values(Mode).flatMap((tabMode) =>
        tabMode !== currentMode && tabMode !== Mode.EnterQuestions
          ? [getLabel(tabMode)]
          : [],
      ),
      icon: (
        <Square
          isFilled={currentMode === Mode.Erase}
          content={currentMode === Mode.Answer ? 'A' : undefined}
        />
      ),
      ...(!isSelected && {
        onClick: () => dispatch(modeToTabMapping[currentMode].onClick()),
      }),
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

  const areQuestionsEntered = useMemo(() => {
    if (!questions) {
      return false;
    }

    return [...questions[Direction.Across], ...questions[Direction.Down]].every(
      ({ question }) => !!question.trim(),
    );
  }, [questions]);

  const isDrawOrEraseMode = mode === Mode.Draw || mode === Mode.Erase;
  const isAnswerOrPuzzleMode = mode === Mode.Puzzle || mode === Mode.Answer;

  const getLoaderLabel = (): string | null => {
    if (fetchAbortController) {
      return requestMode === RequestMode.Generate
        ? 'Generating...'
        : 'Solving...';
    }
    if (requestFailed) {
      return requestMode === RequestMode.Generate
        ? 'We were unable to generate the questions :('
        : 'We couldn’t solve the crossword :(';
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
            !isDrawOrEraseMode || fetchAbortController
              ? () => dispatch(editCrosswordAndAbortFetch())
              : undefined
          }
          {...((isDrawOrEraseMode ||
            (isAnswerOrPuzzleMode && requestMode !== RequestMode.Solve)) && {
            selectedTab: getTabByModeAndIsSelected(mode, true),
            secondaryTab: getTabByModeAndIsSelected(
              modeToTabMapping[mode].otherMode,
              false,
            ),
          })}
        />
      </GridWrapper>
      <TransitionContainer
        className='app__full-size-wrapper'
        items={[
          {
            key: 'label',
            content: (
              <Label
                content='Let’s draw some squares first!'
                size={LabelSize.Large}
              />
            ),
            hide: !isDrawOrEraseMode || !!fetchAbortController || !isGridEmpty,
            center: true,
          },
          {
            key: 'buttons',
            content: (
              <div className='app__option-buttons'>
                <Button
                  label='Generate questions'
                  onClick={() => dispatch(generateQuestions())}
                />
                <Button
                  label='Enter questions & solve'
                  onClick={() => dispatch(switchToEnteringQuestions())}
                />
              </div>
            ),
            hide: !isDrawOrEraseMode || !!fetchAbortController || isGridEmpty,
          },
          {
            key: 'questions',
            content: questions && (
              <div className='app__questions'>
                <TransitionContainer
                  items={[
                    {
                      key: 'questions-label',
                      content: (
                        <Label
                          content='Please enter questions below:'
                          size={LabelSize.Small}
                        />
                      ),
                      hide: areQuestionsEntered || mode !== Mode.EnterQuestions,
                    },
                    {
                      key: 'questions-panel',
                      content: (
                        <Button
                          label='Solve!'
                          onClick={() => dispatch(solveQuestions())}
                        />
                      ),
                      hide:
                        !areQuestionsEntered ||
                        mode !== Mode.EnterQuestions ||
                        !!fetchAbortController,
                      center: true,
                    },
                    {
                      key: 'replace-questions',
                      content: (
                        <Button
                          label='Replace questions'
                          onClick={() => dispatch(editQuestionsAndAbortFetch())}
                        />
                      ),
                      hide: !(
                        requestMode === RequestMode.Solve &&
                        (isAnswerOrPuzzleMode || !!fetchAbortController)
                      ),
                      center: true,
                    },
                  ]}
                />
                <div className='app__questions-list'>
                  {[
                    {
                      direction: Direction.Across,
                      label: 'Across',
                      color: QuestionPanelColor.Pink,
                    },
                    {
                      direction: Direction.Down,
                      label: 'Down',
                      color: QuestionPanelColor.Yellow,
                    },
                  ].map(
                    ({ direction, label, color }) =>
                      questions[direction].length > 0 && (
                        <div
                          key={direction}
                          className='app__questions-list-item'
                        >
                          <Label content={label} size={LabelSize.Medium} />
                          <QuestionPanel
                            questions={questions[direction]}
                            isEditable={
                              mode === Mode.EnterQuestions &&
                              !fetchAbortController
                            }
                            color={color}
                            onChange={(question, index) =>
                              dispatch(
                                updateQuestion({
                                  direction,
                                  id: questions[direction][index].id,
                                  question,
                                }),
                              )
                            }
                          />
                        </div>
                      ),
                  )}
                </div>
              </div>
            ),
            hide: mode !== Mode.EnterQuestions && !isAnswerOrPuzzleMode,
          },
        ]}
      />
    </Layout>
  );
}

export default App;
