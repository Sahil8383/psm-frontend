import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import propertyReducer from "./slices/propertySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    property: propertyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
