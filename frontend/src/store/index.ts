import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLUMNS, ROWS } from 'appConstants';

export enum Direction {
  Across = 'across',
  Down = 'down',
}

export type CellPosition = {
  row: number;
  column: number;
};

export enum Mode {
  Draw = 'draw',
  Erase = 'erase',
  EnterQuestions = 'enterQuestions',
  Answer = 'answer',
  Puzzle = 'puzzle',
}

export type UpdateQuestionPayload = {
  direction: Direction;
  id: number;
  question: string;
};

export type Question = {
  id: number;
  question: string;
  startPosition: CellPosition;
};

export type State = {
  mode: Mode;
  grid: ({ letter: string | null; number: number | null } | null)[][];
  questions: {
    [Direction.Across]: Question[];
    [Direction.Down]: Question[];
  } | null;
  fetchAbortController: AbortController | null;
  showConfirmation: boolean;
};

function getQuestionsFromGrid(grid: State['grid']) {
  const acrossQuestions: Question[] = [];
  const downQuestions: Question[] = [];

  const shifts = [
    {
      array: acrossQuestions,
      shift: [0, 1],
    },
    {
      array: downQuestions,
      shift: [1, 0],
    },
  ];

  let currentId = 1;

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column]) {
        const arrays = [];

        for (const {
          array,
          shift: [rowShift, columnShift],
        } of shifts) {
          if (
            !grid[row - rowShift]?.[column - columnShift] &&
            grid[row + rowShift]?.[column + columnShift]
          ) {
            arrays.push(array);
          }
        }

        if (arrays.length > 0) {
          arrays.forEach((array) =>
            array.push({
              id: currentId,
              question: '',
              startPosition: { row, column },
            })
          );
          currentId += 1;
        }
      }
    }
  }

  return { across: acrossQuestions, down: downQuestions };
}

const initialState: State = {
  mode: Mode.Draw,
  grid: [...Array(ROWS)].map(() => [...Array(COLUMNS)].map(() => null)),
  questions: null,
  fetchAbortController: null,
  showConfirmation: false,
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    fillCell: (state: State, action: PayloadAction<CellPosition>) => {
      state.grid[action.payload.row][action.payload.column] = {
        letter: null,
        number: null,
      };
    },
    eraseCell: (state: State, action: PayloadAction<CellPosition>) => {
      state.grid[action.payload.row][action.payload.column] = null;
    },
    switchToDrawing: (state: State) => {
      state.mode = Mode.Draw;
    },
    switchToErasing: (state: State) => {
      state.mode = Mode.Erase;
    },
    switchToAnswer: (state: State) => {
      state.mode = Mode.Answer;
    },
    switchToPuzzle: (state: State) => {
      state.mode = Mode.Puzzle;
    },
    switchToEnteringQuestions: (state: State) => {
      state.mode = Mode.EnterQuestions;

      const { across, down } = getQuestionsFromGrid(state.grid);

      state.questions = {
        across,
        down,
      };

      [...across, ...down].forEach(({ id, startPosition: { row, column } }) => {
        state.grid[row][column]!.number = id;
      });
    },
    updateQuestion: (
      state: State,
      {
        payload: { direction, id, question },
      }: PayloadAction<UpdateQuestionPayload>
    ) => {
      state.questions![direction] = state.questions![direction].map(
        (oldQuestion) =>
          oldQuestion.id === id ? { ...oldQuestion, question } : oldQuestion
      );
    },
    generateQuestions: (state: State) => {
      // creates new AbortController and assignes it to fetchAbortController, makes API call to generate questions and,
      // after data is fetched, sets fetchAbortController to null,
      // sets questions to API response and updates grid accordingly
    },
    solveQuestions: (state: State) => {
      // creates new AbortController and assignes it to fetchAbortController, makes API call to solve questions and,
      // after data is fetched, sets fetchAbortController to null,
      // updates grid according to API response
    },
    showConfirmation: (state: State) => {
      state.showConfirmation = true;
    },
    dismissConfirmation: (state: State) => {
      state.showConfirmation = false;
    },
    editCrossword: (state: State) => {
      state.fetchAbortController = null;
      state.showConfirmation = false;
      state.mode = Mode.Draw;
      state.questions = null;
      state.grid = state.grid.map((row) =>
        row.map((cell) =>
          cell ? { ...cell, letter: null, number: null } : null
        )
      );
    },
    editQuestions: (state: State) => {
      state.fetchAbortController = null;
      state.mode = Mode.EnterQuestions;
    },
  },
});

const store = configureStore({
  reducer: {
    general: generalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const editQuestionsAndAbortFetch =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    getState().general.fetchAbortController?.abort();
    dispatch(generalSlice.actions.editQuestions());
  };

export const editCrosswordAndAbortFetch =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    getState().general.fetchAbortController?.abort();
    dispatch(generalSlice.actions.editCrossword());
  };

export const {
  fillCell,
  eraseCell,
  switchToDrawing,
  switchToErasing,
  switchToAnswer,
  switchToPuzzle,
  switchToEnteringQuestions,
  updateQuestion,
  showConfirmation,
  dismissConfirmation,
} = generalSlice.actions;

export default store;
