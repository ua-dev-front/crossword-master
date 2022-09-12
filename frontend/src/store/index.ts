import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { columns, Mode, rows } from 'appConstants';

export enum Direction {
  Row = 'row',
  Column = 'column',
}

export type CellPosition = {
  row: number;
  column: number;
};

type UpdateQuestionPayload = {
  direction: Direction;
  id: number;
  question: string;
};

type Question = {
  id: number;
  question: string;
  startPosition: CellPosition;
};

type State = {
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
  grid: [...Array(rows)].map(() => [...Array(columns)].map(() => null)),
  questions: null,
  fetchAbortController: null,
  showConfirmation: false,
};

const generalSlice = createSlice({
  name: 'everything',
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

export default store;
