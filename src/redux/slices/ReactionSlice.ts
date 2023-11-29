import { createSlice } from "@reduxjs/toolkit";

export interface ReactionState {
  isLoadingAdd: boolean;
  isLoadingGetReactionOfPost: boolean;
  isLoadingDelete: boolean;
  error: any;
}

const initialState: ReactionState = {
  isLoadingAdd: false,
  isLoadingGetReactionOfPost: false,
  isLoadingDelete: false,
  error: {}
};

export const Slice = createSlice({
  name: "Reaction",
  initialState,
  reducers: {
    addReactionPending(state) {
      state.isLoadingAdd = true;
    },
    addReactionSuccess(state) {
      state.isLoadingAdd = false;
      state.error = {};
    },
    addReactionError(state, action) {
      state.isLoadingAdd = false;
      state.error = action.payload;
    },
    getReactionOfPostPending(state) {
      state.isLoadingGetReactionOfPost = true;
    },
    getReactionOfPostSuccess(state) {
      state.isLoadingGetReactionOfPost = false;
      state.error = {};
    },
    getReactionOfPostError(state, action) {
      state.isLoadingGetReactionOfPost = false;
      state.error = action.payload;
    },
    deleteReactionPending(state) {
      state.isLoadingDelete = true;
    },
    deleteReactionSuccess(state) {
      state.isLoadingDelete = false;
      state.error = {};
    },
    deleteReactionError(state, action) {
      state.isLoadingDelete = false;
      state.error = action.payload;
    },
  },
});

export const { addReactionPending, addReactionSuccess, addReactionError, 
  getReactionOfPostPending, getReactionOfPostSuccess, getReactionOfPostError,
  deleteReactionPending, deleteReactionSuccess, deleteReactionError } = Slice.actions;

export default Slice.reducer;
