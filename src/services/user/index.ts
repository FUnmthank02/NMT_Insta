import API from "@/configs/api";
import { setUser, updateAvatarSuccess } from "@/redux/slices/AuthSlice";
import { editProfileError, editProfilePending, editProfileSuccess } from "@/redux/slices/EditProfileSlice";
import { searchError, searchPending, searchSuccess } from "@/redux/slices/SearchSlice";
import { AppDispatch } from "@/redux/store";
import { HTTP_STATUS_CODE } from "@/utilities/enums";

export const UserServices = {
  editProfileProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (user: any) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(editProfilePending());
    API.editProfile(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(editProfileSuccess());
          onSuccess(response?.data?.message);
        } else {
          dispatch(editProfileError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(editProfileError(err.message));
      });
  },
  uploadAvatarProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    const formData = new FormData();
    const emptyBlob = new Blob([""], { type: "text/plain" });
    if (params.file.name) {
      formData.append("file", params.file, params.file.name);
    } else {
      formData.append("file", emptyBlob, "");
    }
    API.uploadAvatar(params.userId, formData)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          onSuccess(response?.data?.message);
          dispatch(updateAvatarSuccess(response?.data?.data?.mediaUrl));
        } else {
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        onFail(err?.message);
      });
  },
  getUsersProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (data: any) => void,
    onFail: (message: string) => void,
  ) => {
    dispatch(searchPending())
    API.getUsers(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(searchSuccess());
          onSuccess(response?.data?.data);
        } else {
          dispatch(searchError(response?.data?.message));
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        dispatch(searchError(err.message));
      });
  },
  getSingleUserProcess: (
    dispatch: AppDispatch,
    params: any
  ) => {
    API.getSingleUser(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          dispatch(editProfileSuccess());
          dispatch(setUser(response?.data?.data));
        } else {
          dispatch(editProfileError(response?.data?.message));
        }
      })
      .catch((err: any) => {
        dispatch(editProfileError(err.message));
      });
  },
  getSingleUserByUsernameProcess: (
    dispatch: AppDispatch,
    params: any,
    onSuccess: (message: string) => void,
    onFail: (message: string) => void,
  ) => {
    API.getSingleUserByUsername(params)
      .then((response) => {
        if (response.data.statusCode === HTTP_STATUS_CODE.SUCCESS) {
          onSuccess(response?.data?.data);
        } else {
          onFail(response?.data?.message);
        }
      })
      .catch((err: any) => {
        onFail(err?.message);
      });
  },
};
