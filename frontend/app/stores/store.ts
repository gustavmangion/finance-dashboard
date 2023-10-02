import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import _userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import { uploadApi } from "../apis/base/upload/uploadService";
import storage from "./storage";
import persistReducer from "redux-persist/lib/persistReducer";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistStore,
} from "redux-persist";
import { userApi } from "../apis/base/user/userService";
import { portfolioApi } from "../apis/base/portfolio/portfolioService";
import { accountApi } from "../apis/base/account/accountService";
import { transactionApi } from "../apis/base/transaction/transactionService";

const persistConfig = {
	key: "root",
	storage,
};

const userReducer = persistReducer(persistConfig, _userReducer);

export const store = configureStore({
	reducer: {
		[uploadApi.reducerPath]: uploadApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[portfolioApi.reducerPath]: portfolioApi.reducer,
		[accountApi.reducerPath]: accountApi.reducer,
		[transactionApi.reducerPath]: transactionApi.reducer,
		userReducer,
		notificationReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			// redux-persist
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(
			uploadApi.middleware,
			userApi.middleware,
			portfolioApi.middleware,
			accountApi.middleware,
			transactionApi.middleware
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
