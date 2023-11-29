import API from "@/configs/api";
import { addCommentError, addCommentPending, addCommentSuccess, 
  deleteCommentError, deleteCommentPending, deleteCommentSuccess, 
  updateCommentError, updateCommentPending, updateCommentSuccess 
} from "@/redux/slices/CommentSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const CommentServices = {
  addCommentProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(addCommentPending());
    API.addComment(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(addCommentSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(addCommentError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(addCommentError(err.message));
      });
  },
  updateCommentProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(updateCommentPending());
    API.updateComment(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(updateCommentSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(updateCommentError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(updateCommentError(err.message));
      });
  },
  deleteCommentProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(deleteCommentPending());
    API.deleteComment(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(deleteCommentSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(deleteCommentError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(deleteCommentError(err.message));
      });
  },
  
}