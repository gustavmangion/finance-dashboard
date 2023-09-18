import {
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
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
import {
	useDeletePortfolioMutation,
	useEditPortfolioMutation,
	useGetPortfoliosQuery,
} from "../apis/base/portfolio/portfolioService";
import { EditPortfolioModel } from "../apis/base/portfolio/types";
import { displayError, displaySuccess } from "../stores/notificationSlice";
import LoadingSkeleton from "../components/loadingSkeleton";

type Props = {
	setView: (val: PageView) => void;
};

export default function PortfolioEdit({ setView }: Props) {
	const portfolios = useAppSelector((state) => state.userReducer.portfolios);
	const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0].id);
	const [portfolioName, setPortfolioName] = useState(portfolios[0].name);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const dispatch = useDispatch();
	const [editPortfolio] = useEditPortfolioMutation();
	const [deletePortfolio] = useDeletePortfolioMutation();
	const { isLoading, isFetching } = useGetPortfoliosQuery(null);

	if (isLoading) return <LoadingSkeleton />;

	return (
		<div className={styles.portfolioEdit}>
			<h2>Manage Portfolios</h2>
			{isFetching ? (
				<CircularProgress />
			) : (
				<>
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
								onClick={handleDelete}
							>
								Delete
							</LoadingButton>
						</div>
					</form>
					<Button onClick={() => setView(PageView.Accounts)}>Back</Button>
				</>
			)}
			<Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
				<div className={materialStyles.modal}>
					<h3>There are accounts linked to this portfolio</h3>
					<p>Delete move these accounts to other portfolios before deleting</p>
					<Button
						className={materialStyles.primaryButton}
						onClick={() => setShowDeleteModal(false)}
					>
						Ok
					</Button>
				</div>
			</Modal>
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
				dispatch(displaySuccess("Portfolio updated"));
			} else dispatch(displayError(null));
		});
	}

	function handleDelete() {
		setDeleteLoading(true);
		deletePortfolio(selectedPortfolio).then((result) => {
			setDeleteLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Portfolio deleted"));
				setSelectedPortfolio(portfolios[0].id);
				setPortfolioName(portfolios[0].name);
			} else if ("error" in result) {
				const error = result.error;
				if ("data" in error && error.data === "Portfolio has linked accounts")
					setShowDeleteModal(true);
				else dispatch(displayError(null));
			}
		});
	}
}
