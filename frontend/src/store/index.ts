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

const makeApiRequest = async <T extends GenerateResponse | SolveResponse>(
  endpoint: string,
  body: object,
  abortSignal: AbortSignal,
  retryCallback: CallableFunction,
): Promise<T | null> => {
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
    if (!(error instanceof Error && error.name !== 'AbortError')) {
      return null;
    }

    console.error(error);
    retryCallback();
  }

  return null;
};

export const generateQuestions = createAsyncThunk<
  GenerateResponse,
  void,
  { state: RootState }
>('generateQuestions', async (_, { getState, dispatch, rejectWithValue }) => {
  const {
    general: { fetchAbortController, grid },
  } = getState();

  const response = await makeApiRequest<GenerateResponse>(
    GENERATE_ENDPOINT,
    { table: getNumberGrid(grid) },
    fetchAbortController!.signal,
    () => dispatch(generateQuestions()),
  );

  if (!response) {
    return rejectWithValue(null);
  }

  return response;
});

export const solveQuestions = createAsyncThunk<
  SolveResponse,
  void,
  { state: RootState }
>('solveQuestions', async (_, { getState, dispatch, rejectWithValue }) => {
  const {
    general: { fetchAbortController, grid, questions },
  } = getState();

  const response = await makeApiRequest<SolveResponse>(
    SOLVE_ENDPOINT,
    {
      table: getNumberGrid(grid),
      words: questions,
    },
    fetchAbortController!.signal,
    () => dispatch(solveQuestions()),
  );

  if (!response) {
    return rejectWithValue(null);
  }

  return response;
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
      state.mode = Mode.EnterQuestions;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateQuestions.pending, (state) => {
      state.fetchAbortController = new AbortController();
    });
    builder.addCase(generateQuestions.fulfilled, (state: State, action) => {
      state.fetchAbortController = null;

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
    });
    builder.addCase(solveQuestions.fulfilled, (state, action) => {
      state.fetchAbortController = null;

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
      state.mode = Mode.Puzzle;
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
