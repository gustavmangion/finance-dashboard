import { createSlice } from "@reduxjs/toolkit";

type UserState = {
	accountSetup: boolean;
};

const initialState = {
	accountSetup: false,
} as UserState;

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserIsSetup: (state: any) => {
			state.accountSetup = true;
		},
	},
});

export const { setUserIsSetup } = user.actions;

export default user.reducer;
