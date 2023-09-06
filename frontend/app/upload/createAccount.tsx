import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import styles from "../styles/upload.module.scss";
import { useAppSelector } from "../hooks/reduxHook";
import { LoadingButton } from "@mui/lab";
import materialStyles from "../styles/material.module.scss";
import { AccountCreationModel } from "../apis/base/account/types";
import { useCreateAccountMutation } from "../apis/base/account/accountService";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";
import UploadingSpinner from "./uploadingSpinner";
import { useResubmitUploadMutation } from "../apis/base/upload/uploadService";
import { ResubmitUpload } from "../apis/base/upload/types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

type Props = {
	uploadId: string;
	accountsToBeSetup: string[];
	handleNextFile: (uploadError: boolean) => void;
};

export default function CreateAccount({
	uploadId,
	accountsToBeSetup,
	handleNextFile,
}: Props) {
	const [loading, setLoading] = useState(false);
	const [index, setIndex] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const dispatch = useDispatch();

	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	const [createAccount] = useCreateAccountMutation();
	const [resubmitUpload] = useResubmitUploadMutation();

	const [formState, setFormState] = useState({
		portfolio: portfolios.length === 1 ? portfolios[0].id : "",
		name: "",
	});

	useEffect(() => {
		if (index === accountsToBeSetup.length) {
			const resubmitModel: ResubmitUpload = new ResubmitUpload();
			resubmitModel.uploadId = uploadId;
			resubmitUpload(resubmitModel).then((result) => {
				if ("error" in result) {
					dispatch(
						displayError("Unable to upload your statement, please try again")
					);
					setIndex(index + 1); //prevent component from firing again
					handleNextFile(true);
				} else {
					setIndex(index + 1); //prevent component from firing again
					handleNextFile(false);
				}
			});
		}
	}, [
		index,
		dispatch,
		accountsToBeSetup.length,
		uploadId,
		resubmitUpload,
		handleNextFile,
	]);

	return (
		<div className={styles.newAccount}>
			{index >= accountsToBeSetup.length ? (
				<UploadingSpinner />
			) : (
				<>
					<h3>
						Add a new bank account{" "}
						{accountsToBeSetup.length > 1
							? `${index + 1} of ${accountsToBeSetup.length}`
							: null}
					</h3>
					<h4>Account number: {accountsToBeSetup[index]}</h4>

					<form onSubmit={handleSubmit}>
						<TextField
							name="name"
							label="Account Name"
							variant="standard"
							value={formState.name}
							onChange={handleChange}
							inputProps={{ maxLength: 45 }}
							required
						/>
						<FormControl>
							<InputLabel>Portfolio</InputLabel>
							<Select
								name="portfolio"
								label="Portfolio"
								variant="standard"
								onChange={handleSelectChange}
								value={formState.portfolio}
								required
								placeholder="Portfolio"
							>
								{portfolios.map((x) => {
									return (
										<MenuItem key={x.id} value={x.id}>
											{x.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						{errorMessage !== "" ? (
							<p className="errorMessage">{errorMessage}</p>
						) : null}
						<LoadingButton
							className={materialStyles.primaryButton}
							type="submit"
							loading={loading}
						>
							Save
						</LoadingButton>
					</form>
				</>
			)}
		</div>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
		setErrorMessage("");
	}

	function handleSelectChange(e: SelectChangeEvent) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
		setErrorMessage("");
	}

	async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const newAccount: AccountCreationModel = new AccountCreationModel();
		newAccount.name = formState.name;
		newAccount.portfolioId = formState.portfolio;
		newAccount.accountNumber = accountsToBeSetup[index];

		createAccount(newAccount).then((result) => {
			setLoading(false);
			if ("error" in result) {
				const error: FetchBaseQueryError = result.error as FetchBaseQueryError;
				if (typeof error.data === "string") {
					setErrorMessage(error.data);
				}
			} else {
				setFormState({
					...formState,
					name: "",
				});
				setIndex(index + 1);
			}
		});
	}
}
