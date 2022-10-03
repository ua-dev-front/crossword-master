import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  API_URL,
  COLUMNS,
  GENERATE_ENDPOINT,
  ROWS,
  SOLVE_ENDPOINT,
} from 'appConstants';
import { getQuestionId, getQuestionsFromGrid } from './helpers';

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

export type GenerateResponseWord = {
  answer: string;
  question: string;
  startPosition: CellPosition;
};

export type GenerateResponse = {
  words: {
    [Direction.Across]: GenerateResponseWord[];
    [Direction.Down]: GenerateResponseWord[];
  };
};

export type SolveResponseWord = {
  id: number;
  answer: string;
};

export type SolveResponse = {
  answers: {
    [Direction.Across]: SolveResponseWord[];
    [Direction.Down]: SolveResponseWord[];
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

export const solveQuestions = createAsyncThunk<
  SolveResponse,
  void,
  { state: RootState }
>('solveQuestions', async (_, { getState }) => {
  const {
    general: { fetchAbortController, grid, questions },
  } = getState();

  const response = await fetch(`${API_URL}${SOLVE_ENDPOINT}`, {
    headers: {
      'Content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      table: grid.map((row) => row.map((cell) => (cell ? 1 : 0))),
      words: questions,
    }),
    signal: fetchAbortController?.signal,
  });

  return response.json();
});

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
  extraReducers: (builder) => {
    builder.addCase(generateQuestions.pending, (state) => {
      state.fetchAbortController = new AbortController();
    });
    builder.addCase(generateQuestions.rejected, (state, { error }) => {
      console.error(`Generating questions failed: ${error.stack}`);
    });
    builder.addCase(generateQuestions.fulfilled, (state, action) => {
      state.fetchAbortController = null;

      Object.entries(action.payload.words).forEach(([direction, questions]) => {
        state.questions![direction as Direction] = questions.map(
          (question) => ({
            question: question.question,
            id: getQuestionId(direction as Direction, question, state.grid),
            startPosition: question.startPosition,
          })
        );

        questions.forEach((question) => {
          question.answer.split('').forEach((letter, index) => {
            let { row, column } = question.startPosition;
            if (direction === Direction.Across) {
              column += index;
            } else {
              row += index;
            }
            state.grid[row][column] = {
              letter,
              number:
                index === 0
                  ? getQuestionId(direction as Direction, question, state.grid)
                  : null,
            };
          });
        });
      });
    });
    builder.addCase(solveQuestions.pending, (state) => {
      state.fetchAbortController = new AbortController();
    });
    builder.addCase(solveQuestions.rejected, (state, { error }) => {
      console.error(`Solving questions failed: ${error.stack}`);
    });
    builder.addCase(solveQuestions.fulfilled, (state, action) => {
      state.fetchAbortController = null;

      Object.entries(action.payload.answers).forEach(([direction, answers]) => {
        answers.forEach((answer) => {
          answer.answer.split('').forEach((letter, index) => {
            const currentQuestion = state.questions![
              direction as Direction
            ].find((question) => question.id === answer.id)!;
            let {
              startPosition: { row, column },
            } = currentQuestion;
            const { id } = currentQuestion;

            if (direction === Direction.Across) {
              column += index;
            } else {
              row += index;
            }

            state.grid[row][column] = {
              letter,
              number: id,
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
