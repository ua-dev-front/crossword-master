import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

enum Direction {
  Row = 'row',
  Column = 'column',
}

enum Mode {
  Draw = 'draw',
  Erase = 'erase',
  EnterQuestions = 'enterQuestions',
  Answer = 'answer',
  Puzzle = 'puzzle',
}

type CellAtionPayload = {
  row: number;
  column: number;
};

type EditQuestionPayload = {
  direction: Direction;
  id: number;
  question: string;
};

type Question = {
  id: number;
  question: string;
  startPosition: {
    row: number;
    column: number;
  };
};

type InitialState = {
  mode: Mode;
  grid: ({ letter: string | null; number: number | null } | null)[][];
  questions: {
    across: Question[];
    down: Question[];
  } | null;
  isFetchingFromApi: boolean;
  showConfirmation: boolean;
};

const initialState: InitialState = {
  mode: Mode.Draw,
  grid: [],
  questions: null,
  isFetchingFromApi: false,
  showConfirmation: false,
};

const generalSlice = createSlice({
  name: 'everything',
  initialState,
  reducers: {
    fillCell: (state, action: PayloadAction<CellAtionPayload>) => {
      // fills specified cell
    },
    eraseCell: (state, action: PayloadAction<CellAtionPayload>) => {
      // erases specified cell
    },
    switchToDrawing: () => {
      // switches the mode to Draw
    },
    switchToErasing: () => {
      // switches the mode to Erase
    },
    switchToAnswer: () => {
      // switches the mode to Answer
    },
    switchToPuzzle: () => {
      // switches the mode to Puzzle
    },
    switchToEnteringQuestions: () => {
      // switches the mode to EnterQuestions, and creates empty questions
    },
    editQuestion: (state, action: PayloadAction<EditQuestionPayload>) => {
      // Updates question for specified id
    },
    generateQuestions: () => {
      // sets isFetchingFromApi to true, makes API call to generate questions and,
      // after data is fetched, sets isFetchingFromApi to false,
      // sets questions to API response and updates grid accordingly
    },
    solveQuestions: () => {
      // sets isFetchingFromApi to true, makes API call to solve questions and,
      // after data is fetched, sets isFetchingFromApi to false,
      // updates grid according to API response
    },
    showConfirmation: () => {
      // sets showConfirmation to true
    },
    hideConfirmation: () => {
      // sets showConfirmation to false
    },
    editCrossword: () => {
      // sets isFetchingFromApi to false, sets showConfirmation to false,
      // sets mode to Draw, resets questions and removes letters & numbers from grid.
    },
    editQuestions: () => {
      // sets isFetchingFromApi to false, sets mode to EnterQuestions.
    },
  },
});

const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
