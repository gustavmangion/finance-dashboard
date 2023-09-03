import { FormLabel, Input } from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";

export default function CreateAccount() {
	const [formState, setFormState] = useState({
		portfolio: "",
		name: "",
		password: "",
	});

	return (
		<div>
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
			</form>
		</div>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {}
}
