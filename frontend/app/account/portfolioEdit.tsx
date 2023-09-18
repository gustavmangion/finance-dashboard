import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { PageView } from "./page";
import { useAppSelector } from "../hooks/reduxHook";
import { ChangeEvent, useState } from "react";
import styles from "../styles/account.module.scss";
import materialStyles from "../styles/material.module.scss";
import { LoadingButton } from "@mui/lab";

type Props = {
	setView: (val: PageView) => void;
};

export default function PortfolioEdit({ setView }: Props) {
	const portfolios = useAppSelector((state) => state.userReducer.portfolios);
	const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0].id);
	const [portfolioName, setPortfolioName] = useState(portfolios[0].name);
	const [loading, setLoading] = useState(false);
	return (
		<div className={styles.portfolioEdit}>
			<h2>Manage Portfolios</h2>
			<FormControl>
				<InputLabel>Portfolio</InputLabel>
				<Select
					name="portfolio"
					label="Portfolio"
					variant="standard"
					onChange={handleSelectChange}
					value={selectedPortfolio}
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
			<form onSubmit={handleSubmit}>
				<TextField
					name="name"
					label="Portfolio Name"
					variant="standard"
					onChange={handleChange}
					value={portfolioName}
					required
				/>
				<div className={styles.formButtons}>
					<LoadingButton
						className={materialStyles.primaryButton}
						type="submit"
						loading={loading}
					>
						Save
					</LoadingButton>
					<LoadingButton
						className={materialStyles.secondaryButton}
						loading={loading}
					>
						Delete
					</LoadingButton>
				</div>
			</form>
			<Button onClick={() => setView(PageView.Accounts)}>Back</Button>
		</div>
	);

	function handleSelectChange(e: SelectChangeEvent) {
		setSelectedPortfolio(e.target.value);
		setPortfolioName(
			portfolios.find((x) => x.id === e.target.value)?.name as string
		);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setPortfolioName(e.target.value);
	}

	function handleSubmit() {}
}
