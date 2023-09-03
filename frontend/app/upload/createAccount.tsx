import {
	FormLabel,
	Input,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import styles from "../styles/upload.module.scss";
import { useAppSelector } from "../hooks/reduxHook";

export default function CreateAccount() {
	const [formState, setFormState] = useState({
		portfolio: "",
		name: "",
		password: "",
	});

	const portfolios = useAppSelector((state) => state.userReducer.portfolios);
	const defaultPortfolio = portfolios.length === 1 ? portfolios[0].id : "";
	return (
		<div className={styles.newAccount}>
			<h3>Add a new bank account</h3>
			<form onSubmit={handleSubmit}>
				<FormLabel>Account Name</FormLabel>
				<Input
					name="name"
					value={formState.name}
					onChange={handleChange}
					required
				/>
				<FormLabel>Statement Password</FormLabel>
				<Input
					name="password"
					type="password"
					value={formState.password}
					onChange={handleChange}
				/>
				<Select
					name="portfolio"
					label="Portfolio"
					onChange={handleSelectChange}
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
