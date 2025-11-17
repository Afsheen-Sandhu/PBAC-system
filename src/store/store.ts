import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter/counterSlice";
import { apiSlice } from "@/services/api";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// ✅ Typed hooks helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
