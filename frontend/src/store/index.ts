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
import {
  getIndexedQuestions,
  getNumberGrid,
  getQuestionsFromGrid,
} from './helpers';

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

export type Questions = {
  [Direction.Across]: Question[];
  [Direction.Down]: Question[];
};

export type State = {
  mode: Mode;
  grid: ({ letter: string | null; number: number | null } | null)[][];
  questions: Questions | null;
  fetchAbortController: AbortController | null;
  requestMode: Mode.Draw | Mode.EnterQuestions | null;
  requestFailed: boolean;
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
  } | null;
};

export type SolveResponseWord = {
  id: number;
  answer: string;
};

export type SolveResponse = {
  answers: {
    [Direction.Across]: SolveResponseWord[];
    [Direction.Down]: SolveResponseWord[];
  } | null;
};

const makeApiRequest = async <
  FullfilledType extends GenerateResponse | SolveResponse,
  RejectedType,
>(
  endpoint: string,
  body: object,
  abortSignal: AbortSignal,
  retryCallback: CallableFunction,
  reject: (value: unknown) => RejectedType,
): Promise<FullfilledType | RejectedType> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
      signal: abortSignal,
    });

    if (response.status !== 200) {
      throw new Error(await response.json());
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return reject(null);
    }

    console.error(error);
    retryCallback();
  }

  return reject(null);
};

export const generateQuestions = createAsyncThunk<
  GenerateResponse,
  void,
  { state: RootState }
>('generateQuestions', async (_, { getState, dispatch, rejectWithValue }) => {
  const { fetchAbortController, grid } = getState();

  return makeApiRequest<GenerateResponse, ReturnType<typeof rejectWithValue>>(
    GENERATE_ENDPOINT,
    { table: getNumberGrid(grid) },
    fetchAbortController!.signal,
    () => dispatch(generateQuestions()),
    (value: unknown) => rejectWithValue(value),
  );
});

export const solveQuestions = createAsyncThunk<
  SolveResponse,
  void,
  { state: RootState }
>('solveQuestions', async (_, { getState, dispatch, rejectWithValue }) => {
  const { fetchAbortController, grid, questions } = getState();

  return makeApiRequest<SolveResponse, ReturnType<typeof rejectWithValue>>(
    SOLVE_ENDPOINT,
    {
      table: getNumberGrid(grid),
      words: questions,
    },
    fetchAbortController!.signal,
    () => dispatch(solveQuestions()),
    (value: unknown) => rejectWithValue(value),
  );
});

const initialState: State = {
  mode: Mode.Draw,
  grid: [...Array(ROWS)].map(() => [...Array(COLUMNS)].map(() => null)),
  questions: null,
  fetchAbortController: null,
  requestMode: null,
  requestFailed: false,
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
      }: PayloadAction<UpdateQuestionPayload>,
    ) => {
      state.questions![direction] = state.questions![direction].map(
        (oldQuestion) =>
          oldQuestion.id === id ? { ...oldQuestion, question } : oldQuestion,
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
      state.requestFailed = false;
      state.showConfirmation = false;
      state.mode = Mode.Draw;
      state.questions = null;
      state.grid = state.grid.map((row) =>
        row.map((cell) =>
          cell ? { ...cell, letter: null, number: null } : null,
        ),
      );
    },
    editQuestions: (state: State) => {
      state.fetchAbortController = null;
      state.requestFailed = false;
      state.mode = Mode.EnterQuestions;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateQuestions.pending, (state) => {
      state.fetchAbortController = new AbortController();
      state.requestMode = Mode.Draw;
    });
    builder.addCase(generateQuestions.fulfilled, (state: State, action) => {
      state.fetchAbortController = null;
      if (action.payload.words === null) {
        state.requestFailed = true;
        return;
      }

      const getStartPositionString = (startPosition: CellPosition): string =>
        `${startPosition.row} ${startPosition.column}`;

      state.questions = getQuestionsFromGrid(state.grid);
      Object.entries(action.payload.words).forEach(([direction, questions]) => {
        const indexedQuestions = getIndexedQuestions(
          state.questions![direction as Direction],
          (question) => getStartPositionString(question.startPosition),
        );

        state.questions![direction as Direction] = questions.map(
          (question) => ({
            question: question.question,
            id: indexedQuestions[getStartPositionString(question.startPosition)]
              .id,
            startPosition: question.startPosition,
          }),
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
                  ? indexedQuestions[
                      getStartPositionString(question.startPosition)
                    ].id
                  : state.grid[row][column]?.number ?? null,
            };
          });
        });
      });
      state.mode = Mode.Puzzle;
    });
    builder.addCase(solveQuestions.pending, (state) => {
      state.fetchAbortController = new AbortController();
      state.requestMode = Mode.EnterQuestions;
    });
    builder.addCase(solveQuestions.fulfilled, (state, action) => {
      state.fetchAbortController = null;
      if (action.payload.answers === null) {
        state.requestFailed = true;
        return;
      }

      Object.entries(action.payload.answers).forEach(([direction, answers]) => {
        const indexedQuestions = getIndexedQuestions(
          state.questions![direction as Direction],
          (question) => question.id,
        );

        answers.forEach((answer) => {
          answer.answer.split('').forEach((letter, index) => {
            const currentQuestion = indexedQuestions[answer.id];
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
              number:
                index === 0 ? id : state.grid[row][column]?.number ?? null,
            };
          });
        });
      });
      state.mode = Mode.Answer;
    });
  },
});

const store = configureStore({
  reducer: generalSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['fetchAbortController'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const editQuestionsAndAbortFetch =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    getState().fetchAbortController?.abort();
    dispatch(generalSlice.actions.editQuestions());
  };

export const editCrosswordAndAbortFetch =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    getState().fetchAbortController?.abort();
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
