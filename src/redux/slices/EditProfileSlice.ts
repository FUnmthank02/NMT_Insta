import { createSlice } from "@reduxjs/toolkit";

export interface EditProfileState {
  loading: boolean;
  error: any;
  refresh: boolean;
}

const initialState: EditProfileState = {
  loading: false,
  error: {},
  refresh: false
};

export const Slice = createSlice({
  name: "editProfile",
  initialState,
  reducers: {
    editProfilePending(state) {
      state.loading = true;
    },
    editProfileSuccess(state) {
      state.loading = false;
      state.error = {};
      state.refresh = !state.refresh;
    },
    editProfileError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { editProfilePending, editProfileSuccess, editProfileError } = Slice.actions;

export default Slice.reducer;
