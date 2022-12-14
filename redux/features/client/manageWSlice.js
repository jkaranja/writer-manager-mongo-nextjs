import { createSlice } from "@reduxjs/toolkit";

//slice
const initialState = {
  writers: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
const manageWSlice = createSlice({
  name: "writers",
  initialState,
  reducers: {
    setWriters: (state, action) => {
      state.writers = action.payload;
    },
    addWriter: (state, action) => {
      state.writers.unshift(action.payload);
    },
    updateWriters: (state, action) => {
      state.writers = state.writers.map((writer) => {
        if (writer._id === action.payload._id) {
          //sent the whole writer doc
          return action.payload;
        }
        return writer; //return unchanged writer
      });
    },
    removeWriter: (state, action) => {
      state.writers = state.writers.filter(
        (writer) => writer._id !== action.payload.id
      );
    },
    //not you can either use immer or return a state//with a concise arrow function, return is added auto,
    //this means you are directly modifying and returning state and immer gives:
    //Error: An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft
    //either add curly braces to use immer in body or add void or use the allowed return// return new array//can't modify existing state//reducer rules
    //you will have to spread the whole state object {...state, writers: state.writers.modify // writers: [..state.writers, uuu]}
    //not you can;t use concise arror function if you're returning an object 'cause of curly braces//signifies body
    resetWriters: (state, action) => void(state.writers = []),
  },
});

export const writersSelect = (state) => state.manageW;

export const {
  setWriters,
  resetWriters,
  removeWriter,
  updateWriters,
  addWriter,
} = manageWSlice.actions;

export default manageWSlice.reducer;
