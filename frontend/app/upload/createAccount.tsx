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
import {
	AccountsCreationModel,
	NewAccountModel,
} from "../apis/base/account/types";
import { useCreateAccountsMutation } from "../apis/base/account/accountService";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";
import UploadSuccessModal from "./uploadSuccessModal";
import LoadingSkeleton from "../components/loadingSkeleton";

type Props = {
	uploadId: string;
	setFormStep: (val: number) => void;
	setFileId: (val: string) => void;
	accountsToBeSetup: string[];
};

export default function CreateAccount({
	uploadId,
	setFormStep,
	setFileId,
	accountsToBeSetup,
}: Props) {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [accounts, setAccounts] = useState<NewAccountModel[]>([]);
	const dispatch = useDispatch();

	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	const [createAccounts] = useCreateAccountsMutation();

	const [formState, setFormState] = useState({
		portfolio: portfolios.length === 1 ? portfolios[0].id : "",
		name: "",
	});

	useEffect(() => {
		if (accounts.length === accountsToBeSetup.length) {
			setLoading(true);
			const model: AccountsCreationModel = new AccountsCreationModel();
			model.accounts = accounts;
			model.uploadId = uploadId;
			createAccounts(model).then((result) => {
				if ("data" in result) {
					setModalOpen(true);
				} else dispatch(displayError("Unable to create your account"));
				setLoading(false);
			});
		}
	}, [accounts, dispatch, accountsToBeSetup.length, uploadId, createAccounts]);

	return (
		<div className={styles.newAccount}>
			<h4>Account number: {accountsToBeSetup[accounts.length]}</h4>
			{accounts.length === accountsToBeSetup.length ? (
				<h3>Processing your statement, Hang on...</h3>
			) : (
				<>
					<h3>
						Add a new bank account{" "}
						{accountsToBeSetup.length > 1
							? `${accounts.length + 1} of ${accountsToBeSetup.length}`
							: null}
					</h3>
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
						<FormControl fullWidth>
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
						<LoadingButton
							className={materialStyles.primaryButton}
							type="submit"
							loading={loading}
						>
							Next
						</LoadingButton>
					</form>
				</>
			)}
			<UploadSuccessModal
				modalOpen={modalOpen}
				setFormStep={setFormStep}
				setFileId={setFileId}
			/>
		</div>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	function handleSelectChange(e: SelectChangeEvent) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		const newAccount: NewAccountModel = new NewAccountModel();
		newAccount.name = formState.name;
		newAccount.portfolioId = formState.portfolio;

		setAccounts((current) => [...current, newAccount]);

		setFormState({
			...formState,
			name: "",
		});
	}
}
