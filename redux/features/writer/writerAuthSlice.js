import { createSlice } from "@reduxjs/toolkit";

let writer = null;
if (typeof window !== "undefined") {
  // Get user from localStorage
  const writer = JSON.parse(localStorage.getItem("writer"));
  //default is null else client login already, client + token is local storage
}

const initialState = {
  writer: writer ? writer : "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const writerSlice = createSlice({
  name: "writer",
  initialState,
  reducers: {
    loginSetWriter: (state, action) => {
      state.writer = action.payload;
    },
  },
});

export const writerAuthSelect = (state) => state.writerAuth;

export const { loginSetWriter } = writerSlice.actions;
export default writerSlice.reducer;
