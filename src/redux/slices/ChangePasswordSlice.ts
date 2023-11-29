import { createSlice } from "@reduxjs/toolkit";

export interface ChangePasswordState {
  loading: boolean;
  error: any;
}

const initialState: ChangePasswordState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    changePasswordPending(state) {
      state.loading = true;
    },
    changePasswordSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    changePasswordError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { changePasswordPending, changePasswordSuccess, changePasswordError } = Slice.actions;

export default Slice.reducer;
