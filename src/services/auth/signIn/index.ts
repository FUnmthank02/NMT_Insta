import API from "@/configs/api";
import { logout, setUserToken } from "@/redux/slices/AuthSlice";
import { signInError, signInPending, signInSuccess } from "@/redux/slices/SignInSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const SignInServices = {
  signInProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: () => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(signInPending());
    API.signIn(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(
            setUserToken({
              user: response.data.data.user,
              token: response.data.data.token,
            }),
          );
          dispatch(signInSuccess());
          onSuccess();
        } else {
          dispatch(signInError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err) => {
        dispatch(signInError(err.message));
        onFail(err.message);
      });
  },
  logOutProcess: (dispatch: AppDispatch) => {
    dispatch(logout());
  },
};