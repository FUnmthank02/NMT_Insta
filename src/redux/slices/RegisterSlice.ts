import { createSlice } from "@reduxjs/toolkit";

export interface RegisterState {
  loading: boolean;
  error: any;
}

const initialState: RegisterState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerPending(state) {
      state.loading = true;
    },
    registerSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    registerError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { registerPending, registerSuccess, registerError } = Slice.actions;

export default Slice.reducer;
