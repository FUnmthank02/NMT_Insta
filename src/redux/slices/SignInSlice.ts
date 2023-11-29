import { createSlice } from "@reduxjs/toolkit";

export interface SignInState {
  loading: boolean;
  error: any;
}

const initialState: SignInState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    signInPending(state) {
      state.loading = true;
    },
    signInSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    signInError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signInPending, signInSuccess, signInError } = Slice.actions;

export default Slice.reducer;
