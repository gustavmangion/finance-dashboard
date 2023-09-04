import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import styles from "../styles/upload.module.scss";
import { useAppSelector } from "../hooks/reduxHook";
import { LoadingButton } from "@mui/lab";
import materialStyles from "../styles/material.module.scss";
import { AccountCreationModel } from "../apis/base/account/types";
import { useCreateAccountMutation } from "../apis/base/account/accountService";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";
import { useRouter } from "next/navigation";

type Props = {
	uploadId: string;
};

export default function CreateAccount({ uploadId }: Props) {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	const [createAccount] = useCreateAccountMutation();

	const [formState, setFormState] = useState({
		portfolio: portfolios.length === 1 ? portfolios[0].id : "",
		name: "",
		password: "",
	});
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
					inputProps={{ maxLength: 45 }}
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
					Save
				</LoadingButton>
			</form>
			<Modal open={modalOpen} onClose={handleModalClose}>
				<div className={materialStyles.modal}>
					<p>Your statement is being processed and will be available shortly</p>
					<Button
						className={materialStyles.primaryButton}
						onClick={handleModalClose}
					>
						Continue
					</Button>
				</div>
			</Modal>
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
		setLoading(true);
		const accountForCreation: AccountCreationModel = new AccountCreationModel();
		accountForCreation.name = formState.name;
		accountForCreation.statementCode = formState.password;
		accountForCreation.portfolioId = formState.portfolio;
		accountForCreation.uploadId = "08dbac4b-66c8-4e21-860d-5290d90c9b00";

		createAccount(accountForCreation).then((result) => {
			if ("data" in result) {
				setModalOpen(true);
			} else dispatch(displayError("Unable to create your account"));
		});

		setLoading(false);
	}

	function handleModalClose() {
		router.push("/");
	}
}
