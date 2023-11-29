import { createSlice } from "@reduxjs/toolkit";

export interface PostsState {
  loadingGetMyPosts: boolean;
  loadingCreatePost: boolean;
  loadingUpdatePost: boolean;
  loadingDeletePost: boolean;
  loadingGetFollowingPosts: boolean;
  loadingUploadPostMedia: boolean;
  error: any;
}

const initialState: PostsState = {
  loadingGetMyPosts: false,
  loadingCreatePost: false,
  loadingUpdatePost: false,
  loadingDeletePost: false,
  loadingGetFollowingPosts: false,
  loadingUploadPostMedia: false,
  error: {}
};

export const Slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getMyPostsPending(state) {
      state.loadingGetMyPosts = true;
    },
    getMyPostsSuccess(state) {
      state.loadingGetMyPosts = false;
      state.error = {};
    },
    getMyPostsError(state, action) {
      state.loadingGetMyPosts = false;
      state.error = action.payload;
    },
    createPostPending(state) {
      state.loadingCreatePost = true;
    },
    createPostSuccess(state) {
      state.loadingCreatePost = false;
      state.error = {};
    },
    createPostError(state, action) {
      state.loadingCreatePost = false;
      state.error = action.payload;
    },
    updatePostPending(state) {
      state.loadingUpdatePost = true;
    },
    updatePostSuccess(state) {
      state.loadingUpdatePost = false;
      state.error = {};
    },
    updatePostError(state, action) {
      state.loadingUpdatePost = false;
      state.error = action.payload;
    },
    deletePostPending(state) {
      state.loadingDeletePost = true;
    },
    deletePostSuccess(state) {
      state.loadingDeletePost = false;
      state.error = {};
    },
    deletePostError(state, action) {
      state.loadingDeletePost = false;
      state.error = action.payload;
    },
    getFollowingPostsPending(state) {
      state.loadingGetFollowingPosts = true;
    },
    getFollowingPostsSuccess(state) {
      state.loadingGetFollowingPosts = false;
      state.error = {};
    },
    getFollowingPostsError(state, action) {
      state.loadingGetFollowingPosts = false;
      state.error = action.payload;
    },
    uploadPostMediaPending(state) {
      state.loadingUploadPostMedia = true;
    },
    uploadPostMediaSuccess(state) {
      state.loadingUploadPostMedia = false;
      state.error = {};
    },
    uploadPostMediaError(state, action) {
      state.loadingUploadPostMedia = false;
      state.error = action.payload;
    },
  },
});

export const { getMyPostsPending, getMyPostsSuccess, getMyPostsError,
  createPostPending, createPostSuccess, createPostError,
  updatePostPending, updatePostSuccess, updatePostError,
  deletePostPending, deletePostSuccess, deletePostError,
  getFollowingPostsPending, getFollowingPostsSuccess, getFollowingPostsError ,
  uploadPostMediaPending, uploadPostMediaSuccess, uploadPostMediaError 
} = Slice.actions;

export default Slice.reducer;
