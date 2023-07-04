import { configureStore } from "@reduxjs/toolkit";
import schoolReducer from "./slice";

const store = configureStore({
  reducer: {
    school: schoolReducer,
  },
});

export default store;
