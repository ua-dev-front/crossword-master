import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLUMNS, ROWS } from 'appConstants';

export enum Direction {
  Row = 'row',
  Column = 'column',
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
    across: Question[];
    down: Question[];
  } | null;
  fetchAbortController: AbortController | null;
  showConfirmation: boolean;
};

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
      // switches the mode to EnterQuestions, and creates empty questions
    },
    updateQuestion: (
      state: State,
      action: PayloadAction<UpdateQuestionPayload>
    ) => {
      // Updates question for specified id
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
      // aborts current request to the api, sets fetchAbortController to null, sets showConfirmation to false,
      // sets mode to Draw, resets questions and removes letters & numbers from grid
    },
    updateQuestions: (state: State) => {
      // aborts current request to the api, sets fetchAbortController to null, sets mode to EnterQuestions
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

export const {
  fillCell,
  eraseCell,
  switchToDrawing,
  switchToErasing,
  switchToAnswer,
  switchToPuzzle,
  showConfirmation,
  dismissConfirmation,
} = generalSlice.actions;
export default store;
