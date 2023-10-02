import { Box, Button, Modal, Paper } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { UserShare } from "../apis/base/user/types";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDeleteUserPortfolioMutation } from "../apis/base/portfolio/portfolioService";
import { displayError, displaySuccess } from "../stores/notificationSlice";
import { PortfolioShare } from "../apis/base/portfolio/types";

type Props = {
	sharedWith: PortfolioShare | undefined;
	setSharedWith: (value: any) => void;
};

export default function DeleteSharePortfolioModal({
	sharedWith,
	setSharedWith,
}: Props) {
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const [deleteShare] = useDeleteUserPortfolioMutation();

	return (
		<Modal open={sharedWith !== undefined} onClose={handleClose}>
			<Paper className={materialStyles.modal}>
				<h3>Stop Sharing</h3>
				<p>
					Are you sure you want to stop sharing this portfolio with{" "}
					<strong>{sharedWith?.name}</strong>?
				</p>
				<Box className={materialStyles.buttonsContainer}>
					<LoadingButton
						loading={loading}
						variant="contained"
						onClick={handleDelete}
					>
						Yes
					</LoadingButton>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleClose}
						disabled={loading}
					>
						No
					</Button>
				</Box>
			</Paper>
		</Modal>
	);

	function handleClose() {
		setSharedWith(undefined);
	}

	function handleDelete() {
		setLoading(true);

		deleteShare(sharedWith!.id).then((result) => {
			setLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Portfolio Share removed"));
				handleClose();
			} else dispatch(displayError(null));
		});
	}
}
