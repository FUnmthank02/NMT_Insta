import API from "@/configs/api";
import { changePasswordError, changePasswordPending, changePasswordSuccess } from "@/redux/slices/ChangePasswordSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const ChangePasswordServices = {
  changePasswordProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(changePasswordPending());
    API.changePassword(params.userId, params.changePasswordModel)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(changePasswordSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(changePasswordError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err) => {
        dispatch(changePasswordError(err.message));
        onFail(err.message);
      });
  },
};
