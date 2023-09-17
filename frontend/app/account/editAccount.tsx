import { TextField } from "@mui/material";
import Account from "../apis/base/account/types";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import materialStyles from "../styles/material.module.scss";

type Props = {
	account: Account | undefined;
	setAccountToEdit: (val: Account | undefined) => void;
};

export default function EditAccount({ account, setAccountToEdit }: Props) {
	const [loading, setLoading] = useState(false);
	const [formState, setFormState] = useState({
		name: account?.name,
		accountNumber: account?.accountNumber,
	});

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
		</>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
	}
}
