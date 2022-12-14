import { createSlice } from "@reduxjs/toolkit";


// Get user from localStorage//localStorage.getItem('client')==returns item or null
//Note can only parse 'null' or a stringified object//other invalid syntax error since it returns an object

let client = null;
if (typeof window !== "undefined") {
  client = JSON.parse(localStorage.getItem("client"));
}


//default is null else client login already, client + token is local storage
const initialState = {
  client: client ? client : "", //empty string to prevent type error like null.email  eg in profile
  };

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    loginSetClient: (state, action) => {
      state.client = action.payload;
    },
    logoutClient: (state, action) => {
      state.client = "";
    },
  },
});

export const clientAuthSelect = (state)=>state.clientAuth

export const { loginSetClient, logoutClient } = clientSlice.actions;
export default clientSlice.reducer;
