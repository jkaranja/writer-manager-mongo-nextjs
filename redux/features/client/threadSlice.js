import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../../config/server";

//headers creator//token added by using getState
const API_URL = `${server}/api/clientAPI/tasks/`;
const config = (token) => {
  return {
    headers: {
      "Content-Type": "multipart/form-data", //won't affect fetch/get/ get has no body/data in axios
      Authorization: `Bearer ${token}`,
    },
  };
};

//fetch thread
export const getThread = createAsyncThunk(
  "thread/getAll",
  async (id, thunkAPI) => {
    try {
      const headers = config(thunkAPI.getState().clientAuth.client.token);
      const { data } = await axios.get(API_URL + id, headers);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response && error.response.data && error.response.data.Error) ||
          error.message ||
          error.toString()
      );
    }
  }
);

//add
export const addThreadMessage = createAsyncThunk(
  "thread/add",
  async ({formData, uploadProgress}, thunkAPI) => {
    try {
      const headers = config(thunkAPI.getState().clientAuth.client.token);    

      const { data } = await axios.post(
        `http://localhost:3000/api/clientAPI/tasks/threadAPI`,
        formData,
        {...headers, ...uploadProgress}
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response && error.response.data && error.response.data.Error) ||
          error.message ||
          error.toString()
      );
    }
  }
);

//slice
const initialState = {
  count: 0,
  thread: [],
  singleTask: {},
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    resetAlerts: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetThread: (state) => initialState,
  },

  extraReducers: (builder) => {
    builder
      //get thread
      .addCase(getThread.pending, (state, action) => {
        state.isLoading = true;
        state.message = "Loading...";
      })
      .addCase(getThread.fulfilled, (state, action) => {
        state.singleTask = action.payload.task;
        action.payload.thread && (state.thread = action.payload.thread);
        state.isLoading = false;
        state.isSuccess = true;
        state.message = ""; //not shown
      })
      .addCase(getThread.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //add thread
      .addCase(addThreadMessage.pending, (state, action) => {
        // state.isLoading = true;//you can use progress in state and dispatch
        state.message = "Loading...";
      })

      .addCase(addThreadMessage.fulfilled, (state, action) => {
        state.thread.push(action.payload);
        state.isSuccess = true;
        state.message = "Success! Message sent.";
      })
      .addCase(addThreadMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const threadSelect = (state) => state.thread;

export const { resetThread, resetAlerts } = threadSlice.actions;

export default threadSlice.reducer;
