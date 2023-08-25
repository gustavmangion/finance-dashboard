"use client";

import User, { CreateUser, CreateUserForm } from "@/app/apis/base/user/types";
import { useAppSelector } from "@/app/hooks/reduxHook";
import { initCreateUserForm, setUser } from "@/app/stores/userSlice";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";

export default function SetupUser() {
	const dispatch = useDispatch();
	const user: User | undefined = useAppSelector(
		(state) => state.userReducer.user
	);
	const userForm: CreateUserForm | undefined = useAppSelector(
		(state) => state.userReducer.createUserForm
	);

	console.log(dispatch(initCreateUserForm));

	return (
		<div>
			User Setup
			<br />
			<Button onClick={handleSubmit}>Save</Button>
		</div>
	);

	function handleSubmit() {
		if (user === undefined) {
			const newUser = new CreateUser();
			newUser.householdName = userForm?.householdName as string;

			// dispatch(setUser(newUser));
		}
	}
}
