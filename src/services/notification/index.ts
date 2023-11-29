import API from "@/configs/api";
import { addNotificationError, addNotificationPending, addNotificationSuccess, deleteNotificationError, deleteNotificationPending, deleteNotificationSuccess, getNotificationError, getNotificationPending, getNotificationSuccess, updateNotificationError, updateNotificationPending, updateNotificationSuccess } from "@/redux/slices/NotificationSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const NotificationServices = {
  getNotificationProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (data: any) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(getNotificationPending());
    API.getNotification(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(getNotificationSuccess());
          onSuccess(response?.data?.data);
        } else {
          dispatch(getNotificationError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(getNotificationError(err.message));
      });
  },
  updateNotificationProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(updateNotificationPending());
    API.updateNotificationOfUser(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(updateNotificationSuccess());
          onSuccess();
        } else {
          dispatch(updateNotificationError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(updateNotificationError(err.message));
      });
  },
  addNotificationProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(addNotificationPending());
    API.addNotification(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(addNotificationSuccess());
          onSuccess();
        } else {
          dispatch(addNotificationError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(addNotificationError(err.message));
      });
  },
  updateAllNotificationProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(updateNotificationPending());
    API.updateAllNotificationOfUser(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(updateNotificationSuccess());
          onSuccess();
        } else {
          dispatch(updateNotificationError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(updateNotificationError(err.message));
      });
  },
  deleteNotificationProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(deleteNotificationPending());
    API.deleteNotification(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(deleteNotificationSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(deleteNotificationError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(deleteNotificationError(err.message));
      });
  },
  
}