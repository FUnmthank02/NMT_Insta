import API from "@/configs/api";
import { forgotPasswordError, forgotPasswordPending, forgotPasswordSuccess } from "@/redux/slices/ForgotPasswordSlice";
import { resetPasswordError, resetPasswordPending, resetPasswordSuccess } from "@/redux/slices/ResetPasswordSlice";
import { validateResetCodeError, validateResetCodePending, validateResetCodeSuccess } from "@/redux/slices/ValidateResetCodeSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const ForgotPasswordServices = {
  forgotPasswordProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(forgotPasswordPending());
    API.forgotPassword(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(forgotPasswordSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(forgotPasswordError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err) => {
        dispatch(forgotPasswordError(err.message));
        onFail(err.message);
      });
  },
  resetPasswordProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(resetPasswordPending());
    API.resetPassword(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(resetPasswordSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(resetPasswordError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err) => {
        dispatch(resetPasswordError(err.message));
        onFail(err.message);
      });
  },
  validateResetCodeProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(validateResetCodePending());
    API.validateResetCode(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(validateResetCodeSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(validateResetCodeError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err) => {
        dispatch(validateResetCodeError(err.message));
        onFail(err.message);
      });
  },
};
