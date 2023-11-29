import { createSlice } from "@reduxjs/toolkit";

export interface ValidateResetCodeState {
  loading: boolean;
  error: any;
}

const initialState: ValidateResetCodeState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "validateResetCode",
  initialState,
  reducers: {
    validateResetCodePending(state) {
      state.loading = true;
    },
    validateResetCodeSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    validateResetCodeError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { validateResetCodePending, validateResetCodeSuccess, validateResetCodeError } = Slice.actions;

export default Slice.reducer;
