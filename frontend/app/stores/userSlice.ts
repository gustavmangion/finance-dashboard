import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User, { CreateUserForm } from "../apis/base/user/types";

type UserState = {
	user: User | undefined;
	portfolioInput: string;
	needUploadStatement: boolean;
};

const initialState = {
	user: undefined,
	portfolioInput: "",
	needUploadStatement: false,
} as UserState;

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state: any, action: PayloadAction<User | undefined>) => {
			state.user = action.payload;
		},
		setPortfolioInput: (state: any, action: PayloadAction<string>) => {
			state.portfolioInput = action.payload;
		},
		setNeedUploadStatement: (state: any, action: PayloadAction<boolean>) => {
			state.needUploadStatement = action.payload;
		},
	},
});

export const { setUser, setPortfolioInput, setNeedUploadStatement } =
	user.actions;

export default user.reducer;
