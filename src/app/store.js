import { configureStore } from "@reduxjs/toolkit";
import colorReducer from "../features/color/colorSlice.js";
import userReducer from "../features/user/userSlice.js";
import classReducer from "../features/class/classSlice.js";
import sessionReducer from "../features/session/sessionSlice.js";

export const store = configureStore({
  reducer: {
    color: colorReducer,
    user: userReducer,
    class: classReducer,
    session: sessionReducer,
  },
});
