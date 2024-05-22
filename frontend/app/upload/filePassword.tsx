import { Alert, Box, Button, TextField } from "@mui/material";
import styles from "../styles/upload.module.scss";
import materialStyles from "../styles/material.module.scss";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import {
	SetNewStatementPassword,
	UploadStatementResponse,
} from "../apis/base/upload/types";
import { useSetNewPasswordMutation } from "../apis/base/upload/uploadService";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";
import UploadingSpinner from "./uploadingSpinner";

type Props = {
	fileId: string;
	setFormStep: (val: number) => void;
	setStatementFirstPage: (val: Uint8Array) => void;
	setAccountsToBeSetup: (val: string[]) => void;
	handleNextFile: (uploadError: boolean) => void;
	setStatementAlreadyUploaded: (val: boolean) => void;
};

export default function FilePassword({
	fileId,
	setFormStep,
	setStatementFirstPage,
	setAccountsToBeSetup,
	handleNextFile,
	setStatementAlreadyUploaded,
}: Props) {
	const [passwordInput, setPasswordInput] = useState("");
	const [displayPasswordIncorrect, setDisplayPasswordIncorrect] =
		useState(false);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const [setNewPassword] = useSetNewPasswordMutation();

	return (
		<div className={styles.newAccount}>
			{loading ? (
				<UploadingSpinner />
			) : (
				<>
					<h3>Add a new bank account</h3>
					<form onSubmit={handleSubmit}>
						<TextField
							name="password"
							label="Statement Password"
							type="password"
							variant="standard"
							value={passwordInput}
							required
							onChange={handleChange}
						/>
						{displayPasswordIncorrect ? (
							<Alert severity="error" className={materialStyles.formAlert}>
								Password is incorrect, please try again
							</Alert>
						) : null}
						<Box className={materialStyles.buttonsContainer}>
							<Button variant="contained" type="submit">
								Next
							</Button>
						</Box>
					</form>
				</>
			)}
		</div>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setPasswordInput(e.target.value);
		if (displayPasswordIncorrect) setDisplayPasswordIncorrect(false);
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const newStatementPassword: SetNewStatementPassword =
			new SetNewStatementPassword();
		newStatementPassword.uploadId = fileId;
		newStatementPassword.password = passwordInput;

		setNewPassword(newStatementPassword).then((result) => {
			if ("data" in result) {
				const response: UploadStatementResponse = result.data;
				if (response.needPassword) setDisplayPasswordIncorrect(true);
				else if (response.statementAlreadyUploaded) {
					setStatementAlreadyUploaded(true);
					handleNextFile(false);
				} else if (response.needBankName) {
					setStatementFirstPage(response.statementFirstPage);
					setFormStep(3);
				} else if (response.accountsToSetup.length === 0) handleNextFile(false);
				else {
					setAccountsToBeSetup(response.accountsToSetup);
					setFormStep(4);
				}
			} else {
				dispatch(displayError(null));
				handleNextFile(true);
			}
			setLoading(false);
		});
	}
}
