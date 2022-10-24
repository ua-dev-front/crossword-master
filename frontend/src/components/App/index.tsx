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
} from 'store';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { Mode as GridMode, Props as GridProps } from 'components/Grid';
import Button from 'components/Button';
import GridWrapper from 'components/GridWrapper';
import Label, { LabelSize } from 'components/Label';
import Layout from 'components/Layout';
import QuestionPanel, { QuestionPanelColor } from 'components/QuestionPanel';
import Tabs from 'components/Tabs';
import TransitionContainer from 'components/TransitionContainer';
import Square from 'icons/Square';
import './styles.scss';

function App() {
  const dispatch = useAppDispatch();
  const { grid, mode, questions, fetchAbortController, apiFailed } =
    useAppSelector((state) => state);

  const getTabByModeAndIsSelected = (
    currentMode: Mode.Draw | Mode.Erase,
    isSelected: boolean,
  ) => {
    const getLabel = (labelMode: Mode.Draw | Mode.Erase) => {
      const labelByModeAndIsSelected = {
        [Mode.Draw]: {
          regular: 'Draw',
          selected: 'Drawing',
        },
        [Mode.Erase]: {
          regular: 'Erase',
          selected: 'Erasing',
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
      icon: <Square isFilled={currentMode === Mode.Erase} />,
      hide: !!fetchAbortController,
    };
  };

  const booleanGrid = useMemo(
    () => grid.map((row) => row.map((cell) => !!cell)),
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
        return {
          matrix: grid,
          mode: GridMode.Puzzle,
        };
      // TODO:
      case Mode.Puzzle:
        return {
          matrix: grid,
          mode: GridMode.Puzzle,
        };
      // TODO:
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
        />
      </GridWrapper>
      <TransitionContainer
        className='app__full-size-wrapper'
        items={[
          {
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
            content: (
              <>
                <Button
                  label='Generate questions'
                  onClick={() => dispatch(generateQuestions())}
                />
                <Button
                  label='Enter questions & solve'
                  onClick={() => dispatch(switchToEnteringQuestions())}
                />
              </>
            ),
            hide: !isDrawOrEraseMode || !!fetchAbortController || isGridEmpty,
            className: 'app__option-buttons',
          },
          {
            content: questions && (
              <>
                <TransitionContainer
                  items={[
                    {
                      content: (
                        <Label
                          content='Please enter questions below:'
                          size={LabelSize.Small}
                        />
                      ),
                      hide: areQuestionsEntered,
                    },
                    {
                      content: (
                        <Button
                          label='Solve!'
                          onClick={() => dispatch(solveQuestions())}
                        />
                      ),
                      hide: !areQuestionsEntered,
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
                            isEditable={true}
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
              </>
            ),
            hide: mode !== Mode.EnterQuestions,
            className: 'app__questions',
          },
        ]}
      />
    </Layout>
  );
}

export default App;
