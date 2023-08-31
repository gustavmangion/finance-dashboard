"use client";

import User, { CreateUserModel } from "@/app/apis/base/user/types";
import { useAddUserMutation } from "@/app/apis/base/user/userService";
import { useAppSelector } from "@/app/hooks/reduxHook";
import { setBucketInput, setUser } from "@/app/stores/userSlice";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import styles from "../../styles/home.module.scss";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent, useState } from "react";
import { displayError, displaySuccess } from "@/app/stores/notificationSlice";

export default function SetupUser() {
	const [loading, setLoading] = useState(false);

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
			<LoadingButton
				className={materialStyles.primaryButton}
				onClick={handleSubmit}
				disabled={bucketInput === ""}
				loading={loading}
			>
				Save
			</LoadingButton>
		</div>
	);

	function updateBucketInput(e: ChangeEvent<HTMLInputElement>) {
		dispatch(setBucketInput(e.target.value));
	}

	async function handleSubmit() {
		if (user?.id === "Not Found") {
			const newUser = new CreateUserModel();
			newUser.bucketName = bucketInput as string;
			setLoading(true);
			await addUser(newUser)
				.then((result) => {
					setLoading(false);
					if ("data" in result) {
						dispatch(setUser(result.data));
						dispatch(displaySuccess("Account created!"));
					} else dispatch(displayError(null));
				})
				.catch((error) => console.log(error));
		}
	}
}
