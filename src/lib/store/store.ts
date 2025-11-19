import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../store/slices/counter/auth-slice";      

export const store = configureStore({
  reducer: {
    auth:   authReducer,

  },
  
});

// ✅ Typed hooks helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
