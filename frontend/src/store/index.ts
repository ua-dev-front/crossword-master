import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Direction {
  Row = 'row',
  Column = 'column',
}

export enum Mode {
  Draw = 'draw',
  Erase = 'erase',
  EnterQuestions = 'enterQuestions',
  Answer = 'answer',
  Puzzle = 'puzzle',
}

export type CellPosition = {
  row: number;
  column: number;
};

export type Question = {
  id: number;
  question: string;
  startPosition: CellPosition;
};

type EditQuestionPayload = {
  direction: Direction;
  id: number;
  question: string;
};

type GeneralState = {
  mode: Mode;
  grid: ({ letter: string | null; number: number | null } | null)[][];
  questions: {
    across: Question[];
    down: Question[];
  } | null;
  fetchAbortController: AbortController | null;
  showConfirmation: boolean;
};

const initialState: GeneralState = {
  mode: Mode.Draw,
  grid: [...Array(10)].map(() => [...Array(10)].map(() => null)),
  questions: null,
  fetchAbortController: null,
  showConfirmation: false,
};

const generalSlice = createSlice({
  name: 'everything',
  initialState,
  reducers: {
    fillCell: (state: GeneralState, action: PayloadAction<CellPosition>) => {
      // fills specified cell
    },
    eraseCell: (state: GeneralState, action: PayloadAction<CellPosition>) => {
      // erases specified cell
    },
    switchToDrawing: (state: GeneralState) => {
      // switches the mode to Draw
    },
    switchToErasing: (state: GeneralState) => {
      // switches the mode to Erase
    },
    switchToAnswer: (state: GeneralState) => {
      // switches the mode to Answer
    },
    switchToPuzzle: (state: GeneralState) => {
      // switches the mode to Puzzle
    },
    switchToEnteringQuestions: (state: GeneralState) => {
      // switches the mode to EnterQuestions, and creates empty questions
    },
    editQuestion: (
      state: GeneralState,
      action: PayloadAction<EditQuestionPayload>
    ) => {
      // Updates question for specified id
    },
    generateQuestions: (state: GeneralState) => {
      // creates new AbortController and assignes it to fetchAbortController, makes API call to generate questions and,
      // after data is fetched, sets fetchAbortController to null,
      // sets questions to API response and updates grid accordingly
    },
    solveQuestions: (state: GeneralState) => {
      // creates new AbortController and assignes it to fetchAbortController, makes API call to solve questions and,
      // after data is fetched, sets fetchAbortController to null,
      // updates grid according to API response
    },
    showConfirmation: (state: GeneralState) => {
      // sets showConfirmation to true
    },
    dismissConfirmation: (state: GeneralState) => {
      // sets showConfirmation to false
    },
    editCrossword: (state: GeneralState) => {
      // aborts current request to the api, sets fetchAbortController to null, sets showConfirmation to false,
      // sets mode to Draw, resets questions and removes letters & numbers from grid
    },
    updateQuestions: (state: GeneralState) => {
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
