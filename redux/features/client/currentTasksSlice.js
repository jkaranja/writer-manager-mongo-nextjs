import { createSlice } from "@reduxjs/toolkit";

//slice
const initialState = {
  currentTasks: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
const currentTasksSlice = createSlice({
  name: "currentTasks",
  initialState,
  reducers: {
    setCurrentTasks: (state, action) => {
      state.currentTasks = action.payload;
    },
    deleteCurrentTasks: (state, action) => {
      state.currentTasks.unshift(action.payload);
    },
    moveCurrentTasks: (state, action) => {
      state.currentTasks.unshift(action.payload);
    },
    setCurrentTaskStatus: (state, action) => {
      state.currentTasks.unshift(action.payload);
    },

    resetCurrentTasks: (state, action) => void (state.currentTasks = []),
  },
});

export const currentTasksSelect = (state) => state.currentTasks;

export const { setCurrentTasks, resetCurrentTasks } = currentTasksSlice.actions;

export default currentTasksSlice.reducer;
