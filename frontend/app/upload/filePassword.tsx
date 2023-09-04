import { TextField } from "@mui/material";
import styles from "../styles/upload.module.scss";
import materialStyles from "../styles/material.module.scss";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import {
	SetNewStatementPassword,
	UploadStatementResponse,
} from "../apis/base/upload/types";
import { useSetNewPasswordMutation } from "../apis/base/upload/uploadService";
import UploadSuccessModal from "./uploadSuccessModal";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";

type Props = {
	fileId: string;
	setFormStep: (val: number) => void;
	setAccountsToBeSetup: (val: string[]) => void;
	setFileId: (val: string) => void;
};

export default function FilePassword({
	fileId,
	setFormStep,
	setAccountsToBeSetup,
	setFileId,
}: Props) {
	const [passwordInput, setPasswordInput] = useState("");
	const [displayPasswordIncorrect, setDisplayPasswordIncorrect] =
		useState(false);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);

	const dispatch = useDispatch();
	const [setNewPassword] = useSetNewPasswordMutation();

	return (
		<div className={styles.newAccount}>
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
					<p>Password is incorrect, please try again</p>
				) : null}
				<LoadingButton
					className={materialStyles.primaryButton}
					type="submit"
					loading={loading}
				>
					Next
				</LoadingButton>
			</form>
			<UploadSuccessModal
				modalOpen={modalOpen}
				setFormStep={setFormStep}
				setFileId={setFileId}
			/>
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
				else if (response.accountsToSetup.length === 0) setModalOpen(true);
				else {
					setAccountsToBeSetup(response.accountsToSetup);
					setFormStep(2);
				}
			} else dispatch(displayError(null));
		});

		setLoading(false);
	}
}
