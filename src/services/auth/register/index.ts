import API from "@/configs/api";
import { registerError, registerPending, registerSuccess } from "@/redux/slices/RegisterSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const RegisterServices = {
  registerProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(registerPending());
    API.register(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(registerSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(registerError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err) => {
        dispatch(registerError(err.message));
        onFail(err.message);
      });
  },
};
