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

const initialGrid = [...Array(ROWS)].map(() =>
  [...Array(COLUMNS)].map(() => null)
);

const initialState: State = {
  mode: Mode.Draw,
  grid: initialGrid,
  questions: null,
  fetchAbortController: null,
  showConfirmation: false,
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    fillCell: (state: State, action: PayloadAction<CellPosition>) => {
      // fills specified cell
    },
    eraseCell: (state: State, action: PayloadAction<CellPosition>) => {
      // erases specified cell
    },
    switchToDrawing: (state: State) => {
      // switches the mode to Draw
    },
    switchToErasing: (state: State) => {
      // switches the mode to Erase
    },
    switchToAnswer: (state: State) => {
      // switches the mode to Answer
    },
    switchToPuzzle: (state: State) => {
      // switches the mode to Puzzle
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
      // sets showConfirmation to true
    },
    dismissConfirmation: (state: State) => {
      // sets showConfirmation to false
    },
    editCrossword: (state: State) => {
      state.fetchAbortController?.abort();
      state.fetchAbortController = null;
      state.showConfirmation = false;
      state.mode = Mode.Draw;
      state.questions = null;
      state.grid = state.grid.map((row) =>
        row.map((cell) => {
          if (cell) {
            return { ...cell, letter: null, number: null };
          }
          return null;
        })
      );
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

export default store;
