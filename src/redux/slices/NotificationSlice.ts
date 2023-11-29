import { createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
  isLoadingGet: boolean;
  isLoadingAdd: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  error: any;
}

const initialState: NotificationState = {
  isLoadingGet: false,
  isLoadingAdd: false,
  isLoadingUpdate: false,
  isLoadingDelete: false,
  error: {}
};

export const Slice = createSlice({
  name: "Notification",
  initialState,
  reducers: {
    getNotificationPending(state) {
      state.isLoadingGet = true;
    },
    getNotificationSuccess(state) {
      state.isLoadingGet = false;
      state.error = {};
    },
    getNotificationError(state, action) {
      state.isLoadingGet = false;
      state.error = action.payload;
    },
    addNotificationPending(state) {
      state.isLoadingAdd = true;
    },
    addNotificationSuccess(state) {
      state.isLoadingAdd = false;
      state.error = {};
    },
    addNotificationError(state, action) {
      state.isLoadingAdd = false;
      state.error = action.payload;
    },
    updateNotificationPending(state) {
      state.isLoadingUpdate = true;
    },
    updateNotificationSuccess(state) {
      state.isLoadingUpdate = false;
      state.error = {};
    },
    updateNotificationError(state, action) {
      state.isLoadingUpdate = false;
      state.error = action.payload;
    },
    deleteNotificationPending(state) {
      state.isLoadingDelete = true;
    },
    deleteNotificationSuccess(state) {
      state.isLoadingDelete = false;
      state.error = {};
    },
    deleteNotificationError(state, action) {
      state.isLoadingDelete = false;
      state.error = action.payload;
    },
  },
});

export const { getNotificationPending, getNotificationSuccess, getNotificationError, 
  addNotificationPending, addNotificationSuccess, addNotificationError, 
  updateNotificationPending, updateNotificationSuccess, updateNotificationError,
  deleteNotificationPending, deleteNotificationSuccess, deleteNotificationError } = Slice.actions;

export default Slice.reducer;
