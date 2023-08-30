"use client";

import User, {
	CreateUserForm,
	CreateUserModel,
} from "@/app/apis/base/user/types";
import { useAddUserMutation } from "@/app/apis/base/user/userService";
import { useAppSelector } from "@/app/hooks/reduxHook";
import { setBucketInput, setUser } from "@/app/stores/userSlice";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import styles from "../../styles/home.module.scss";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent } from "react";

export default function SetupUser() {
	const dispatch = useDispatch();
	const user: User | undefined = useAppSelector(
		(state) => state.userReducer.user
	);
	const bucketInput: string = useAppSelector(
		(state) => state.userReducer.bucketInput
	);

	const [addUser, response] = useAddUserMutation();

	return (
		<div className={styles.accountSetup}>
			<div>
				<h2>Let&apos;s get you started</h2>
				<TextField
					id="bucket-name"
					label="Bucket name"
					variant="standard"
					value={bucketInput}
					onChange={updateBucketInput}
					helperText="You can use buckets to group multiple accounts"
				/>
			</div>
			<Button
				className={materialStyles.primaryButton}
				onClick={handleSubmit}
				disabled={bucketInput === ""}
			>
				Save
			</Button>
		</div>
	);

	function updateBucketInput(e: ChangeEvent<HTMLInputElement>) {
		dispatch(setBucketInput(e.target.value));
	}

	async function handleSubmit() {
		if (user === undefined) {
			const newUser = new CreateUserModel();
			newUser.bucketName = bucketInput as string;
			await addUser(newUser).then((response) => {
				console.log("test");
				console.log(response);
			});
		}
	}
}
