import {
	FormLabel,
	Input,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import styles from "../styles/upload.module.scss";
import { useAppSelector } from "../hooks/reduxHook";
import { LoadingButton } from "@mui/lab";
import materialStyles from "../styles/material.module.scss";

export default function CreateAccount() {
	const [formState, setFormState] = useState({
		portfolio: "",
		name: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);

	const portfolios = useAppSelector((state) => state.userReducer.portfolios);
	const defaultPortfolio = portfolios.length === 1 ? portfolios[0].id : "";
	return (
		<div className={styles.newAccount}>
			<h3>Add a new bank account</h3>
			<form onSubmit={handleSubmit}>
				<TextField
					name="name"
					label="Account Name"
					variant="standard"
					value={formState.name}
					onChange={handleChange}
					required
				/>
				<TextField
					name="password"
					label="Statement Password"
					type="password"
					variant="standard"
					value={formState.password}
					onChange={handleChange}
				/>
				<Select
					name="portfolio"
					label="Portfolio"
					variant="standard"
					onChange={handleSelectChange}
					required
					defaultValue={defaultPortfolio}
				>
					{portfolios.map((x) => {
						return (
							<MenuItem key={x.id} value={x.id}>
								{x.name}
							</MenuItem>
						);
					})}
				</Select>
				<LoadingButton
					className={materialStyles.primaryButton}
					type="submit"
					loading={loading}
				>
					Save
				</LoadingButton>
			</form>
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

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {}
}
