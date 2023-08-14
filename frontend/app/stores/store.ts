import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { testApi } from "../apis/base/test/testService";
import navBarReducer from "./navBarSlice";

export const store = configureStore({
	reducer: {
		[testApi.reducerPath]: testApi.reducer,
		navBarReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({}).concat([testApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
