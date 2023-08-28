import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User, { CreateUserForm } from "../apis/base/user/types";

type UserState = {
	user: User | undefined;
	bucketInput: string;
};

const initialState = {
	user: undefined,
	bucketInput: "",
} as UserState;

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state: any, action: PayloadAction<User | undefined>) => {
			state.user = action.payload;
		},
		setBucketInput: (state: any, action: PayloadAction<string>) => {
			state.bucketInput = action.payload;
		},
	},
});

export const { setUser, setBucketInput } = user.actions;

export default user.reducer;
