import { configureStore } from "@reduxjs/toolkit";
import layout from "./layoutSlice";
import { LAYOUT_PERSIST_KEY } from "./layoutSlice";

const persistMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  try {
    if (typeof window !== "undefined") {
      const state = storeAPI.getState();
      const toPersist = state.layout;
      window.localStorage.setItem(LAYOUT_PERSIST_KEY, JSON.stringify(toPersist));
    }
  } catch (e) {
  }
  return result;
};

export const store = configureStore({
  reducer: {
    layout,
  },
  middleware: (getDefault) => getDefault().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;