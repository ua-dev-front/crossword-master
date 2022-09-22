import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { API_URL, COLUMNS, GENERATE_ENDPOINT, ROWS } from 'appConstants';

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

type GenerateResponseDirection = {
  answer: string;
  question: string;
  start_position: CellPosition;
}[];

type GenerateResponse = {
  words: {
    [Direction.Across]: GenerateResponseDirection;
    [Direction.Down]: GenerateResponseDirection;
  };
};

export const generateQuestions = createAsyncThunk<
  GenerateResponse,
  void,
  { state: RootState }
>('generateQuestions', async (_, { getState }) => {
  const {
    general: { fetchAbortController, grid },
  } = getState();

  const response = await fetch(`${API_URL}${GENERATE_ENDPOINT}`, {
    headers: {
      'Content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      table: grid.map((row) => row.map((cell) => (cell ? 1 : 0))),
    }),
    signal: fetchAbortController?.signal,
  });

  return response.json();
});

const initialState: State = {
  mode: Mode.Draw,
  grid: [
    [
      { letter: null, number: null },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      { letter: null, number: null },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      { letter: null, number: null },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      { letter: null, number: null },
      { letter: null, number: null },
      { letter: null, number: null },
      { letter: null, number: null },
      { letter: null, number: null },
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      { letter: null, number: null },
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      { letter: null, number: null },
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ],
  questions: {
    across: [],
    down: [],
  },
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
    updateQuestions: (state: State) => {
      // aborts current request to the api, sets fetchAbortController to null, sets mode to EnterQuestions
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateQuestions.pending, (state) => {
      const fetchAbortController = new AbortController();
      state.fetchAbortController = fetchAbortController;
    });
    builder.addCase(generateQuestions.rejected, (state, { error }) => {
      state.fetchAbortController = null;
      console.error(`Generating questions failed: ${error.stack}`);
    });
    builder.addCase(generateQuestions.fulfilled, (state, action) => {
      state.fetchAbortController = null;

      Object.entries(action.payload.words).forEach(([direction, questions]) => {
        state.questions![direction as Direction] = questions.map(
          (question) => ({
            question: question.question,
            id: Math.floor(Math.random() * 100), // Shouldn't the id be generated on backend?
            startPosition: question.start_position,
          })
        );

        questions.forEach((question) => {
          question.answer.split('').forEach((letter, index) => {
            let { row, column } = question.start_position;
            if (direction === Direction.Across) {
              column += index;
            } else {
              row += index;
            }
            state.grid[row][column] = {
              letter,
              number: index === 0 ? Math.floor(Math.random() * 100) : null, // again, should the id be generated on backend?
            };
          });
        });
      });
    });
  },
});

const store = configureStore({
  reducer: {
    general: generalSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['general.fetchAbortController'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

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
  updateQuestion,
  showConfirmation,
  dismissConfirmation,
} = generalSlice.actions;
export default store;
