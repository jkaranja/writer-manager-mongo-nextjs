import { configureStore } from "@reduxjs/toolkit";

import clientAuthReducer from "../features/client/clientAuthSlice";
import currentTasksReducer from "../features/client/currentTasksSlice";
import writerAuthReducer from "../features/writer/writerAuthSlice";
import manageWReducer from "../features/client/manageWSlice";
import threadsReducer from "../features/client/threadSlice";
const store = configureStore({
  reducer: {
    sidebarStyle: "..Reducer",

    clientAuth: clientAuthReducer,
    manageW: manageWReducer,
    currentTasks: currentTasksReducer,

    writerAuth: writerAuthReducer,
    thread: threadsReducer,
  },
});

export default store;
