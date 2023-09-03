import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../apis/base/user/types";

type UserState = {
	user: User | undefined;
	needUploadStatement: boolean;
};

const initialState = {
	user: undefined,
	needUploadStatement: false,
} as UserState;

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state: any, action: PayloadAction<User | undefined>) => {
			state.user = action.payload;
		},
		setNeedUploadStatement: (state: any, action: PayloadAction<boolean>) => {
			state.needUploadStatement = action.payload;
		},
	},
});

export const { setUser, setNeedUploadStatement } = user.actions;

export default user.reducer;
