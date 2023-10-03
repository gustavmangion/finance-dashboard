"use client";

import User, { CreateUserModel } from "@/app/apis/base/user/types";
import { useAddUserMutation } from "@/app/apis/base/user/userService";
import { useAppSelector } from "@/app/hooks/reduxHook";
import { setUser } from "@/app/stores/userSlice";
import { Box, Button, Modal, Paper, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import styles from "../../styles/home.module.scss";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { displayError, displaySuccess } from "@/app/stores/notificationSlice";
import { useRouter } from "next/navigation";
import { portfolioApi } from "@/app/apis/base/portfolio/portfolioService";

export default function SetupUser() {
	const [loading, setLoading] = useState(false);
	const [formState, setFormState] = useState({
		portfolioName: "",
	});
	const router = useRouter();

	const dispatch = useDispatch();
	const user: User | undefined = useAppSelector(
		(state) => state.userReducer.user
	);

	const [modalOpen, setModalOpen] = useState(user!.userStatus > 1);
	const [addUser] = useAddUserMutation();

	return (
		<div className={styles.accountSetup}>
			<h2>Let&apos;s get you started</h2>
			<form onSubmit={handleSubmit}>
				<TextField
					name="portfolioName"
					label="Portfolio name"
					variant="standard"
					value={formState.portfolioName}
					required
					onChange={handleChange}
					helperText="You can use portfolios to group multiple accounts"
				/>
				<Box className={materialStyles.buttonsContainer}>
					<LoadingButton variant="contained" type="submit" loading={loading}>
						Save
					</LoadingButton>
				</Box>
			</form>
			<Modal open={modalOpen} onClose={redirectToUploadStatement}>
				<Paper className={materialStyles.modal}>
					<p>
						Your account has been created, now let&apos;s upload your first bank
						statement
					</p>
					<Box className={materialStyles.buttonsContainer}>
						<Button variant="contained" onClick={redirectToUploadStatement}>
							Next
						</Button>
					</Box>
				</Paper>
			</Modal>
		</div>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		if (user?.id === "Not Found") {
			const newUser = new CreateUserModel();
			newUser.portfolioName = formState.portfolioName;
			await addUser(newUser).then((result) => {
				setLoading(false);
				if ("data" in result) {
					dispatch(setUser(result.data));
					dispatch(portfolioApi.util.invalidateTags(["Portfolios"]));
					dispatch(displaySuccess("Account created!"));
					setModalOpen(true);
				} else dispatch(displayError(null));
			});
		}
	}

	async function redirectToUploadStatement() {
		setModalOpen(false);
		router.push("/upload");
	}
}
