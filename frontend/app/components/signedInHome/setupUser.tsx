"use client";

import User, { CreateUserModel } from "@/app/apis/base/user/types";
import { useAddUserMutation } from "@/app/apis/base/user/userService";
import { useAppSelector } from "@/app/hooks/reduxHook";
import { setNeedUploadStatement, setUser } from "@/app/stores/userSlice";
import { Button, Modal, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import styles from "../../styles/home.module.scss";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent, useState } from "react";
import { displayError, displaySuccess } from "@/app/stores/notificationSlice";
import { useRouter } from "next/navigation";

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
	const needUploadStatement: boolean = useAppSelector(
		(state) => state.userReducer.needUploadStatement
	);
	const [modalOpen, setModalOpen] = useState(needUploadStatement);

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
				<LoadingButton
					className={materialStyles.primaryButton}
					type="submit"
					loading={loading}
				>
					Save
				</LoadingButton>
			</form>
			<Modal open={modalOpen} onClose={redirectToUploadStatement}>
				<div className={materialStyles.modal}>
					<p>
						Your account has been created, now let&apos;s upload your first bank
						statement
					</p>
					<Button
						className={materialStyles.primaryButton}
						onClick={redirectToUploadStatement}
					>
						Next
					</Button>
				</div>
			</Modal>
		</div>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e: any) {
		e.preventDefault();
		setLoading(true);
		if (user?.id === "Not Found") {
			const newUser = new CreateUserModel();
			newUser.portfolioName = formState.portfolioName;
			await addUser(newUser)
				.then((result) => {
					setLoading(false);
					if ("data" in result) {
						dispatch(setNeedUploadStatement(true));
						dispatch(setUser(result.data));
						dispatch(displaySuccess("Account created!"));
						setModalOpen(true);
					} else dispatch(displayError(null));
				})
				.catch((error) => console.log(error));
		}
	}

	async function redirectToUploadStatement() {
		setModalOpen(false);
		router.push("/upload");
	}
}
