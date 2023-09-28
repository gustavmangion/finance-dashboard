import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../apis/base/user/types";
import Portfolio from "../apis/base/portfolio/types";

type UserState = {
	user: User | undefined;
	portfolios: Portfolio[];
	needUploadStatement: boolean;
};

const initialState = {
	user: undefined,
	portfolios: [],
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
		setPortfolios: (state: any, action: PayloadAction<Portfolio[]>) => {
			state.portfolios = action.payload;
		},
		resetUser: () => initialState,
	},
});

export const { setUser, setNeedUploadStatement, setPortfolios, resetUser } =
	user.actions;

export default user.reducer;
