import API from "@/configs/api";
import { getMyPostsError, getMyPostsPending, getMyPostsSuccess, getFollowingPostsError, 
  getFollowingPostsPending, getFollowingPostsSuccess, createPostError, createPostPending, 
  createPostSuccess, deletePostError, deletePostPending, deletePostSuccess, updatePostError, 
  updatePostPending, updatePostSuccess, uploadPostMediaPending, uploadPostMediaSuccess, uploadPostMediaError } from "@/redux/slices/PostSlice";

import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const PostServices = {
  getFollowingPostsProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(getFollowingPostsPending());
    API.getFollowingPosts(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(getFollowingPostsSuccess());
          onSuccess(response?.data?.data);
        } else {
          dispatch(getFollowingPostsError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(getFollowingPostsError(err.message));
      });
  },
  getMyPostsProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(getMyPostsPending());
    API.getMyPosts(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(getMyPostsSuccess());

          onSuccess(response?.data?.data);
        } else {
          dispatch(getMyPostsError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(getMyPostsError(err.message));
      });
  },
  createPostProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (postId: number) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(createPostPending());
    API.createPost(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(createPostSuccess());
          onSuccess(response?.data?.data?.postId);
        } else {
          dispatch(createPostError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(createPostError(err.message));
      });
  },
  updatePostProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(updatePostPending());
    API.updatePost(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(updatePostSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(updatePostError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(updatePostError(err.message));
      });
  },
  deletePostProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(deletePostPending());
    API.deletePost(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(deletePostSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(deletePostError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(deletePostError(err.message));
      });
  },
  uploadPostMediaProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    const formData = new FormData();
    const emptyBlob = new Blob([""], { type: "text/plain" });
    for(let i = 0; i < params.files.length; i++) {
      if (params.files[i].name) {
        formData.append(`files`, params.files[i], params.files[i].name);
      } else {
        formData.append(`files`, emptyBlob, "");
      }
    }
    dispatch(uploadPostMediaPending());
    API.uploadPostMedia(params.postId, formData)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(uploadPostMediaSuccess());
          onSuccess();
        } else {
          onFail(response?.data?.message);
          dispatch(uploadPostMediaError(response?.data?.message));
        }
      })
      .catch((err: any) => {
        dispatch(uploadPostMediaError(err.message));
      });
  },
}