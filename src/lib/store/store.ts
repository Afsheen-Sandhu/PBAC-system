import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/counter/auth-slice";
import loadingReducer from "../store/slices/counter/loading-slice";
import { apiSlice } from "@/services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// ✅ Typed hooks helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
