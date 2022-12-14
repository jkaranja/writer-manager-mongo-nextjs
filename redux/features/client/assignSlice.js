import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//headers creator//token added by using getState
const API_URL = "/api/order/assign";
const config = (token) => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
};

//assign //NOTE that config = {headers, on upload progress} axios.post(url, data, config)
export const assignNew = createAsyncThunk(
  //generate thunk action creator(delays dispatch) and all promise lifecycle action using 'getReview'
  "new/assign", //action type//uses action type prefix 'review' to match case
  async ({ formData, uploadProgress }, thunkAPI) => {
    //use thunk api and try catch to forward error message as  payload
    try {
      const headers = config(thunkAPI.getState().clientAuth.client.token);
      const configs = { ...headers, ...uploadProgress };
      const { data } = await axios.post(API_URL, formData, configs);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.Error);
    }
  }
);

//slice
const initialState = {
  order: {},
  isError: false,
  progress: 0,
  isSuccess: false,
  message: "",
};
const assignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {
    resetAssignAlerts: (state) => {
      state.progress = 0;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetAssign: (state) => initialState,
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: {
    //assign new order
    [assignNew.pending]: (state, action) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "Uploading...";
    },
    [assignNew.fulfilled]: (state, action) => {
      state.progress = 0;
      state.isError = false;
      state.isSuccess = true;
      state.message = `Success! Order assigned. Find order under 'Unclaimed orders'`;
    },
    [assignNew.rejected]: (state, action) => {
      state.progress = 0;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload;
    },
  },
});

export const { resetAssignAlerts, resetAssign, setProgress } =
  assignSlice.actions;

export default assignSlice.reducer;
