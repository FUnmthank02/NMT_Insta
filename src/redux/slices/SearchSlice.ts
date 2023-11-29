import { createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  loading: boolean;
  error: any;
}

const initialState: SearchState = {
  loading: false,
  error: {},
};

export const Slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchPending(state) {
      state.loading = true;
    },
    searchSuccess(state) {
      state.loading = false;
      state.error = {};
    },
    searchError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { searchPending, searchSuccess, searchError } = Slice.actions;

export default Slice.reducer;
