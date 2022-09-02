import { createSlice } from '@reduxjs/toolkit';
import { Question } from '.';

type questionState = {
  questions: {
    down: Question[];
    across: Question[];
  };
};

const initialState: questionState = {
  questions: {
    down: [],
    across: [],
  },
};

export const questionSlice = createSlice({
  name: 'Questions',
  initialState,
  reducers: {},
});

export default questionSlice.reducer;
