import { configureStore } from "@reduxjs/toolkit";

import clientAuthReducer from "../features/client/clientAuthSlice";

import writerAuthReducer from "../features/writer/writerAuthSlice";
import manageWReducer from "../features/client/manageWSlice";
const store = configureStore({
  reducer: {
    sidebarStyle: "..Reducer",

    clientAuth: clientAuthReducer,
    manageW: manageWReducer,

    writerAuth: writerAuthReducer,
  },
});

export default store;
