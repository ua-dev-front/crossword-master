import { configureStore } from '@reduxjs/toolkit';
import appSlice from 'components/App/appSlice';
import gridSlice from 'components/Grid/gridSlice';
import questionsSlice from 'components/QuestionPanel/questionsSlice';

const store = configureStore({
  reducer: {
    app: appSlice,
    grid: gridSlice,
    questions: questionsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
