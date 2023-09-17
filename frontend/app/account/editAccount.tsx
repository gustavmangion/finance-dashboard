import { Button, TextField } from "@mui/material";
import Account, { EditAccountModel } from "../apis/base/account/types";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import materialStyles from "../styles/material.module.scss";
import { useEditAccountMutation } from "../apis/base/account/accountService";
import { useDispatch } from "react-redux";
import {
	displayNotification,
	displaySuccess,
} from "../stores/notificationSlice";
import { PageView } from "./page";

type Props = {
	account: Account | undefined;
	setView: (val: PageView) => void;
};

export default function EditAccount({ account, setView }: Props) {
	const [loading, setLoading] = useState(false);
	const [formState, setFormState] = useState({
		name: account?.name as string,
	});

	const dispatch = useDispatch();
	const [editAccount] = useEditAccountMutation();

	return (
		<>
			<h2>Editing Account</h2>
			<h4>Account Name: {account?.name}</h4>
			<h4>Account Number: {account?.accountNumber}</h4>
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
				<LoadingButton
					className={materialStyles.primaryButton}
					type="submit"
					loading={loading}
				>
					Update
				</LoadingButton>
			</form>
			<Button onClick={handleBack}>Back</Button>
		</>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
		console.log(model);
		editAccount(model).then((result) => {
			setLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Account has been updated"));
				setView(PageView.Accounts);
			}
		});
	}
}
