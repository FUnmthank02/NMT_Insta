import { createSlice } from "@reduxjs/toolkit";

export interface FollowState {
  isLoadingAdd: boolean;
  isLoadingGetFollowers: boolean;
  isLoadingGetFollowings: boolean;
  isLoadingDelete: boolean;
  error: any;
}

const initialState: FollowState = {
  isLoadingAdd: false,
  isLoadingGetFollowers: false,
  isLoadingGetFollowings: false,
  isLoadingDelete: false,
  error: {}
};

export const Slice = createSlice({
  name: "Follow",
  initialState,
  reducers: {
    addFollowPending(state) {
      state.isLoadingAdd = true;
    },
    addFollowSuccess(state) {
      state.isLoadingAdd = false;
      state.error = {};
    },
    addFollowError(state, action) {
      state.isLoadingAdd = false;
      state.error = action.payload;
    },
    getFollowersPending(state) {
      state.isLoadingGetFollowers = true;
    },
    getFollowersSuccess(state) {
      state.isLoadingGetFollowers = false;
      state.error = {};
    },
    getFollowersError(state, action) {
      state.isLoadingGetFollowers = false;
      state.error = action.payload;
    },
    getFollowingsPending(state) {
      state.isLoadingGetFollowings = true;
    },
    getFollowingsSuccess(state) {
      state.isLoadingGetFollowings = false;
      state.error = {};
    },
    getFollowingsError(state, action) {
      state.isLoadingGetFollowings = false;
      state.error = action.payload;
    },
    deleteFollowPending(state) {
      state.isLoadingDelete = true;
    },
    deleteFollowSuccess(state) {
      state.isLoadingDelete = false;
      state.error = {};
    },
    deleteFollowError(state, action) {
      state.isLoadingDelete = false;
      state.error = action.payload;
    },
  },
});

export const { addFollowPending, addFollowSuccess, addFollowError, 
  getFollowersPending, getFollowersSuccess, getFollowersError,
  getFollowingsPending, getFollowingsSuccess, getFollowingsError,
  deleteFollowPending, deleteFollowSuccess, deleteFollowError } = Slice.actions;

export default Slice.reducer;
