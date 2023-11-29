import { createSlice } from "@reduxjs/toolkit";

export interface ResetPasswordState {
  loading: boolean;
  error: any;
}

const initialState: ResetPasswordState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    resetPasswordPending(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    resetPasswordError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { resetPasswordPending, resetPasswordSuccess, resetPasswordError } = Slice.actions;

export default Slice.reducer;
