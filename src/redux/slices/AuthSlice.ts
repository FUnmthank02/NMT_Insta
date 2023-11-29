import { createSlice } from "@reduxjs/toolkit";
import STORAGE from "@/utilities/storage";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utilities/helper";

export interface AuthState {
  user: any;
  isLoading: boolean;
  accessToken: string;
  refreshToken: string;
  refresh: boolean;
}

export const initialState: AuthState = {
  user: {},
  isLoading: false,
  accessToken: getLocalStorage(STORAGE.accessToken) ?? "",
  refreshToken: getLocalStorage(STORAGE.refreshToken) ?? "",
  refresh: false
};

const Slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoading = false;
    },
    setToken(state, action) {
      setLocalStorage(STORAGE.accessToken, action.payload.accessToken);
      setLocalStorage(STORAGE.refreshToken, action.payload.refreshToken);
      state.isLoading = false;
      state.accessToken = action.payload;
    },
    setUserToken(state, action) {
      setLocalStorage(STORAGE.accessToken, action.payload.token.accessToken);
      setLocalStorage(STORAGE.refreshToken, action.payload.token.refreshToken);
      setLocalStorage(STORAGE.userId, action.payload.user.userId);
      state.user = action.payload.user;
      state.accessToken = action.payload.token.accessToken;
      state.refreshToken = action.payload.token.refreshToken;
      state.isLoading = false;
    },
    updateAvatarSuccess: (state, action) => {
      state.user.avatar = action.payload;
      state.isLoading = false;
      state.refresh = !state.refresh;
    },
    logout(state) {
      removeLocalStorage();
      state.user = {};
      state.accessToken = "";
      state.refreshToken = "";
      state.isLoading = false;
    },
  },
});

export const { setUser, setToken, setUserToken,updateAvatarSuccess, logout } = Slice.actions;

export default Slice.reducer;
