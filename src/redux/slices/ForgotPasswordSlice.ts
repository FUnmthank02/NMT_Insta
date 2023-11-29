import { createSlice } from "@reduxjs/toolkit";

export interface ForgotPasswordState {
  loading: boolean;
  error: any;
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    forgotPasswordPending(state) {
      state.loading = true;
    },
    forgotPasswordSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    forgotPasswordError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { forgotPasswordPending, forgotPasswordSuccess, forgotPasswordError } = Slice.actions;

export default Slice.reducer;
