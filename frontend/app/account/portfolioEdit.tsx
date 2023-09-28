import {
	Box,
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
	useAddPortfolioMutation,
	useDeletePortfolioMutation,
	useEditPortfolioMutation,
	useGetPortfoliosQuery,
} from "../apis/base/portfolio/portfolioService";
import Portfolio, {
	CreatePortfolioModel,
	EditPortfolioModel,
} from "../apis/base/portfolio/types";
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
	const [showNameExistsModal, setShowNameExistsModal] = useState(false);
	const [addingNewPortfolio, setAddingNewPortfolio] = useState(false);

	const dispatch = useDispatch();
	const [editPortfolio] = useEditPortfolioMutation();
	const [deletePortfolio] = useDeletePortfolioMutation();
	const [createPortfolio] = useAddPortfolioMutation();
	const { isLoading, isFetching } = useGetPortfoliosQuery(null);

	if (isLoading) return <LoadingSkeleton />;

	return (
		<div className={styles.portfolioEdit}>
			<h2>Manage Portfolios</h2>
			{isFetching ? (
				<CircularProgress />
			) : (
				<>
					{addingNewPortfolio ? null : (
						<>
							<Button onClick={handleNewPortfolio}>Create New</Button>
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
						</>
					)}
					<form onSubmit={handleSubmit}>
						<TextField
							name="name"
							label="Portfolio Name"
							variant="standard"
							onChange={handleChange}
							value={portfolioName}
							required
						/>
						<Box className={materialStyles.buttonsContainer}>
							<LoadingButton
								variant="contained"
								type="submit"
								loading={submitLoading}
								disabled={deleteLoading}
							>
								Save
							</LoadingButton>
							{addingNewPortfolio ? (
								<Button
									variant="contained"
									color="secondary"
									onClick={handleCancelAddNew}
								>
									Cancel
								</Button>
							) : (
								<LoadingButton
									variant="contained"
									color="secondary"
									loading={deleteLoading}
									disabled={submitLoading}
									onClick={handleDelete}
								>
									Delete
								</LoadingButton>
							)}
						</Box>
					</form>
					<Button
						className={materialStyles.backButton}
						onClick={() => setView(PageView.Accounts)}
					>
						Back
					</Button>
				</>
			)}
			<Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
				<div className={materialStyles.modal}>
					<h3>There are accounts linked to this portfolio</h3>
					<p>Delete move these accounts to other portfolios before deleting</p>
					<Button variant="contained" onClick={() => setShowDeleteModal(false)}>
						Ok
					</Button>
				</div>
			</Modal>
			<Modal
				open={showNameExistsModal}
				onClose={() => setShowNameExistsModal(false)}
			>
				<div className={materialStyles.modal}>
					<h3>Another portfolio already has this name</h3>
					<p>Please chose another name</p>
					<Button
						variant="contained"
						onClick={() => setShowNameExistsModal(false)}
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
		if (!addingNewPortfolio) {
			const model: EditPortfolioModel = new EditPortfolioModel();
			model.id = selectedPortfolio;
			model.body.name = portfolioName.trim();
			editPortfolio(model).then((result) => {
				setSubmitLoading(false);
				if ("data" in result) {
					dispatch(displaySuccess("Portfolio updated"));
				} else if ("error" in result) {
					const error = result.error;
					if ("data" in error && error.data === "Name already used")
						setShowNameExistsModal(true);
					else dispatch(displayError(null));
				}
			});
		} else {
			const model: CreatePortfolioModel = new CreatePortfolioModel();
			model.name = portfolioName;
			createPortfolio(model).then((result) => {
				setSubmitLoading(false);
				if ("data" in result) {
					dispatch(displaySuccess("Portfolio created"));
					const data: Portfolio = result.data;
					setSelectedPortfolio(data.id);
					setAddingNewPortfolio(false);
				} else if ("error" in result) {
					const error = result.error;
					if ("data" in error && error.data === "Name already used")
						setShowNameExistsModal(true);
					else dispatch(displayError(null));
				}
			});
		}
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

	function handleNewPortfolio() {
		setAddingNewPortfolio(true);
		setPortfolioName("");
	}

	function handleCancelAddNew() {
		setAddingNewPortfolio(false);
		setPortfolioName(portfolios.find((x) => x.id === selectedPortfolio)!.name);
	}
}
