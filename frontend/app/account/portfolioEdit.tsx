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
import { ChangeEvent, SyntheticEvent, useState } from "react";
import styles from "../styles/account.module.scss";
import materialStyles from "../styles/material.module.scss";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { useEditPortfolioMutation } from "../apis/base/portfolio/portfolioService";
import { EditPortfolioModel } from "../apis/base/portfolio/types";
import { displayError, displaySuccess } from "../stores/notificationSlice";

type Props = {
	setView: (val: PageView) => void;
};

export default function PortfolioEdit({ setView }: Props) {
	const portfolios = useAppSelector((state) => state.userReducer.portfolios);
	const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0].id);
	const [portfolioName, setPortfolioName] = useState(portfolios[0].name);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const dispatch = useDispatch();
	const [editPortfolio] = useEditPortfolioMutation();

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
						loading={submitLoading}
						disabled={deleteLoading}
					>
						Save
					</LoadingButton>
					<LoadingButton
						className={materialStyles.secondaryButton}
						loading={deleteLoading}
						disabled={submitLoading}
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

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitLoading(true);
		const model: EditPortfolioModel = new EditPortfolioModel();
		model.id = selectedPortfolio;
		model.body.name = portfolioName.trim();
		editPortfolio(model).then((result) => {
			setSubmitLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Portfolio Updated"));
			} else dispatch(displayError(null));
		});
	}
}
