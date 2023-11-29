import API from "@/configs/api";
import { addReactionError, addReactionPending, addReactionSuccess, deleteReactionError, deleteReactionPending, deleteReactionSuccess, getReactionOfPostError, getReactionOfPostPending, getReactionOfPostSuccess } from "@/redux/slices/ReactionSlice";

import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const ReactionServices = {
  getReactionOfPostProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(getReactionOfPostPending());
    API.getReactionOfPost(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(getReactionOfPostSuccess());
          onSuccess(response?.data?.data);
        } else {
          dispatch(getReactionOfPostError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(getReactionOfPostError(err.message));
      });
  },
  createReactionProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(addReactionPending());
    API.createReaction(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(addReactionSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(addReactionError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(addReactionError(err.message));
      });
  },
  deleteReactionProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(deleteReactionPending());
    API.deleteReaction(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(deleteReactionSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(deleteReactionError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(deleteReactionError(err.message));
      });
  },
}