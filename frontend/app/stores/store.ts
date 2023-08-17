import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { testApi } from "../apis/base/test/testService";
import navBarReducer from "./navBarSlice";
import { uploadApi } from "../apis/base/upload/uploadService";

export const store = configureStore({
	reducer: {
		[testApi.reducerPath]: testApi.reducer,
		[uploadApi.reducerPath]: uploadApi.reducer,
		navBarReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({}).concat(testApi.middleware, uploadApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
