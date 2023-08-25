import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User, { CreateUserForm } from "../apis/base/user/types";

type UserState = {
	user: User | undefined;
	createUserForm: CreateUserForm | undefined;
};

const initialState = {
	user: undefined,
	createUserForm: undefined,
} as UserState;

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state: any, action: PayloadAction<User | undefined>) => {
			state.user = action.payload;
		},
		initCreateUserForm: (state: any) => {
			state.createUserForm = new CreateUserForm();
		},
	},
});

export const { setUser, initCreateUserForm } = user.actions;

export default user.reducer;
