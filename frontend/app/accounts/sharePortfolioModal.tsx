import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Paper,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import {
	useAddPortfolioShareMutation,
	useGetPortfolioSharableWithQuery,
} from "../apis/base/portfolio/portfolioService";
import { LoadingButton } from "@mui/lab";
import { CreatePortfolioShareModel } from "../apis/base/portfolio/types";
import { displayError, displaySuccess } from "../stores/notificationSlice";

type Props = {
	modalOpen: boolean;
	portfolioId: string;
	setModalOpen: (value: boolean) => void;
};

export default function SharePortfolioModal({
	modalOpen,
	portfolioId,
	setModalOpen,
}: Props) {
	const [loading, setLoading] = useState(false);
	const [shareWith, setShareWith] = useState("");

	const dispatch = useDispatch();
	const { isLoading, isFetching, data } =
		useGetPortfolioSharableWithQuery(portfolioId);
	const [createShare] = useAddPortfolioShareMutation();

	return (
		<Modal open={modalOpen} onClose={handleClose}>
			<Paper className={materialStyles.modal}>
				{isLoading || isFetching ? (
					<CircularProgress />
				) : data?.length === 0 ? (
					<>
						<h3>No one available to share with</h3>
						<p>
							You link more users with your account from the profile section
						</p>
					</>
				) : (
					<>
						<h3>Share with</h3>
						<form onSubmit={handleSubmit}>
							<Select
								name="shareWith"
								variant="standard"
								onChange={handleSelectChange}
								value={shareWith}
								required
								placeholder="Portfolio"
							>
								{data?.map((x) => {
									return (
										<MenuItem key={x.id} value={x.id}>
											{x.alias}
										</MenuItem>
									);
								})}
							</Select>
							<Box className={materialStyles.buttonsContainer}>
								<LoadingButton
									loading={loading}
									variant="contained"
									type="submit"
								>
									Save
								</LoadingButton>
								<Button
									onClick={handleClose}
									variant="contained"
									color="secondary"
									disabled={loading}
								>
									Cancel
								</Button>
							</Box>
						</form>
					</>
				)}
			</Paper>
		</Modal>
	);

	function handleClose() {
		setShareWith("");
		setModalOpen(false);
	}

	function handleSelectChange(e: SelectChangeEvent) {
		setShareWith(e.target.value);
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const model: CreatePortfolioShareModel = new CreatePortfolioShareModel();
		model.portfolioId = portfolioId;
		model.shareId = shareWith;

		createShare(model).then((result) => {
			setLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Portfolio Shared"));
				handleClose();
			} else dispatch(displayError(null));
		});
	}
}
