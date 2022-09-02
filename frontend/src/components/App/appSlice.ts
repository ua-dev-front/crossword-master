import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode } from 'components/Grid';

type AppState = {
  mode: Mode;
  isFetchingFromApi: boolean;
  showConfirmation: boolean;
};

const initialState: AppState = {
  mode: Mode.Draw,
  isFetchingFromApi: false,
  showConfirmation: false,
};

export const appSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    switchMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    setIsFetchingFromApi: (state, action: PayloadAction<boolean>) => {
      state.isFetchingFromApi = action.payload;
    },
    setShowConfirmation: (state, action: PayloadAction<boolean>) => {
      state.showConfirmation = action.payload;
    },
  },
});

export const { switchMode, setIsFetchingFromApi, setShowConfirmation } =
  appSlice.actions;

export default appSlice.reducer;
