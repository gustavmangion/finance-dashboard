import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import Account, { EditAccountModel } from "../apis/base/account/types";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import materialStyles from "../styles/material.module.scss";
import { useEditAccountMutation } from "../apis/base/account/accountService";
import { useDispatch } from "react-redux";
import { displayError, displaySuccess } from "../stores/notificationSlice";
import { PageView } from "./pageViewEnum";
import { useAppSelector } from "../hooks/reduxHook";
import styles from "../styles/account.module.scss";

type Props = {
	account: Account;
	setView: (val: PageView) => void;
};

export default function EditAccount({ account, setView }: Props) {
	const [loading, setLoading] = useState(false);
	const [formState, setFormState] = useState({
		name: account?.name as string,
		portfolioId: account?.portfolioId as string,
	});

	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	const dispatch = useDispatch();
	const [editAccount] = useEditAccountMutation();

	return (
		<>
			<h2>Editing Account</h2>
			<h4>Account Name: {account?.name}</h4>
			<h4>Account Number: {account?.accountNumber}</h4>
			<div className={styles.accountEditForm}>
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
							name="portfolioId"
							label="Portfolio"
							variant="standard"
							onChange={handleSelectChange}
							value={formState.portfolioId}
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
					<Box className={materialStyles.buttonsContainer}>
						<LoadingButton variant="contained" type="submit" loading={loading}>
							Update
						</LoadingButton>
					</Box>
				</form>
			</div>
			<Button className={materialStyles.backButton} onClick={handleBack}>
				Back
			</Button>
		</>
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

	function handleBack() {
		setView(PageView.Accounts);
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const model: EditAccountModel = new EditAccountModel();
		model.id = account?.id as string;
		model.body.name = formState.name;
		model.body.portfolioId = formState.portfolioId;
		editAccount(model).then((result) => {
			setLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Account has been updated"));
				setView(PageView.Accounts);
			} else dispatch(displayError(null));
		});
	}
}
