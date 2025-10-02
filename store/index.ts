import { configureStore } from "@reduxjs/toolkit";
import layout from "./layoutSlice";

export const store = configureStore({
  reducer: {
    layout,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;