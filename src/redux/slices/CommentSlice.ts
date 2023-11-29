import { createSlice } from "@reduxjs/toolkit";

export interface CommentState {
  isLoadingAdd: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  error: any;
}

const initialState: CommentState = {
  isLoadingAdd: false,
  isLoadingUpdate: false,
  isLoadingDelete: false,
  error: {}
};

export const Slice = createSlice({
  name: "Comment",
  initialState,
  reducers: {
    addCommentPending(state) {
      state.isLoadingAdd = true;
    },
    addCommentSuccess(state) {
      state.isLoadingAdd = false;
      state.error = {};
    },
    addCommentError(state, action) {
      state.isLoadingAdd = false;
      state.error = action.payload;
    },
    updateCommentPending(state) {
      state.isLoadingUpdate = true;
    },
    updateCommentSuccess(state) {
      state.isLoadingUpdate = false;
      state.error = {};
    },
    updateCommentError(state, action) {
      state.isLoadingUpdate = false;
      state.error = action.payload;
    },
    deleteCommentPending(state) {
      state.isLoadingDelete = true;
    },
    deleteCommentSuccess(state) {
      state.isLoadingDelete = false;
      state.error = {};
    },
    deleteCommentError(state, action) {
      state.isLoadingDelete = false;
      state.error = action.payload;
    },
  },
});

export const { addCommentPending, addCommentSuccess, addCommentError, 
  updateCommentPending, updateCommentSuccess, updateCommentError,
  deleteCommentPending, deleteCommentSuccess, deleteCommentError } = Slice.actions;

export default Slice.reducer;
