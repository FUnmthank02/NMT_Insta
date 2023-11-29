import API from "@/configs/api";
import { getFollowingsError, getFollowingsPending, getFollowingsSuccess, 
  getFollowersError, getFollowersPending, getFollowersSuccess, addFollowPending, addFollowSuccess, addFollowError, deleteFollowPending, deleteFollowSuccess, deleteFollowError 
} from "@/redux/slices/FollowSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const FollowServices = {
  getFollowingsProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(getFollowingsPending());
    API.getFollowingsOfUser(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(getFollowingsSuccess());
          onSuccess(response?.data?.data);
        } else {
          dispatch(getFollowingsError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(getFollowingsError(err.message));
      });
  },
  getFollowersProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(getFollowersPending());
    API.getFollowersOfUser(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(getFollowersSuccess());
          onSuccess(response?.data?.data);
        } else {
          dispatch(getFollowersError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(getFollowersError(err.message));
      });
  },
  createFollowProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(addFollowPending());
    API.follow(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(addFollowSuccess());
          onSuccess();
        } else {
          dispatch(addFollowError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(addFollowError(err.message));
      });
  },
  deleteFollowProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(deleteFollowPending());
    API.unfollow(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(deleteFollowSuccess());
          onSuccess();
        } else {
          dispatch(deleteFollowError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(deleteFollowError(err.message));
      });
  },
}