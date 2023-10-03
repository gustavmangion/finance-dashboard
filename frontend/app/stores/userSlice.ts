import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../apis/base/user/types";
import Portfolio from "../apis/base/portfolio/types";

type UserState = {
	user: User | undefined;
	portfolios: Portfolio[];
};

const initialState = {
	user: undefined,
	portfolios: [],
} as UserState;

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state: any, action: PayloadAction<User | undefined>) => {
			state.user = action.payload;
		},
		setPortfolios: (state: any, action: PayloadAction<Portfolio[]>) => {
			state.portfolios = action.payload;
		},
		setFirstUploadDone: (state: any) => {
			state.user.userStatus = 0;
		},
		resetUser: () => initialState,
	},
});

export const { setUser, setPortfolios, setFirstUploadDone, resetUser } =
	user.actions;

export default user.reducer;
