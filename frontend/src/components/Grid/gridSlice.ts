import { createSlice } from '@reduxjs/toolkit';

type gridState = {
  grid: ({
    letter: string | null;
    number: number | null;
  } | null)[][];
};

const initialState: gridState = {
  grid: [],
};

export const gridSlice = createSlice({
  name: 'Grid',
  initialState,
  reducers: {},
});

export default gridSlice.reducer;
