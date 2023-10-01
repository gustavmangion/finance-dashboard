import { Alert, Box, Modal, Paper, TextField } from "@mui/material";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import {
	useAcceptUserShareMutation,
	userApi,
} from "@/app/apis/base/user/userService";
import { AcceptUserShare } from "@/app/apis/base/user/types";
import { displayError, displaySuccess } from "@/app/stores/notificationSlice";

type Props = {
	modalOpen: boolean;
	setModalOpen: (value: boolean) => void;
};

export default function AcceptInviteModal({ modalOpen, setModalOpen }: Props) {
	const [formState, setFormState] = useState({
		code: "",
		shareCode: "",
		name: "",
	});
	const [loading, setLoading] = useState(false);
	const [errorReason, setErrorReason] = useState(-1);

	const dispatch = useDispatch();
	const [acceptInvite] = useAcceptUserShareMutation();

	return (
		<Modal open={modalOpen} onClose={handleClose}>
			<Paper className={materialStyles.modal}>
				<h3>Accept Invite</h3>
				<form onSubmit={handleSubmit}>
					<TextField
						name="code"
						label="Invite Code"
						variant="standard"
						value={formState.code}
						onChange={handleChange}
						required
					/>
					<TextField
						name="shareCode"
						label="Share Code"
						variant="standard"
						type="password"
						value={formState.shareCode}
						onChange={handleChange}
						required
					/>
					<TextField
						name="name"
						label="Name"
						variant="standard"
						value={formState.name}
						onChange={handleChange}
						required
					/>
					{errorReason !== -1 ? (
						<Alert severity="error">
							{errorReason === 1
								? "Invite code or Share code are invalid"
								: "Name already exists"}
						</Alert>
					) : null}
					<Box className={materialStyles.buttonsContainer}>
						<LoadingButton loading={loading} variant="contained" type="submit">
							Accept
						</LoadingButton>
					</Box>
				</form>
			</Paper>
		</Modal>
	);

	function handleClose() {
		setFormState({
			code: "",
			name: "",
			shareCode: "",
		});
		setModalOpen(false);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setErrorReason(-1);
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const model: AcceptUserShare = new AcceptUserShare();
		model.alias = formState.name;
		model.inviteCode = formState.code!;
		model.shareCode = formState.shareCode;

		acceptInvite(model).then((result) => {
			setLoading(false);
			if ("data" in result) {
				dispatch(displaySuccess("Invite accepted"));
				dispatch(userApi.util.invalidateTags(["UserShare"]));
				handleClose();
			} else if ("error" in result) {
				if ("data" in result.error) {
					const error = result.error.data;

					if (error === "Cannot accept invite") setErrorReason(1);
					else if (error === "Alias already exists") setErrorReason(2);
				} else displayError(null);
			} else displayError(null);
		});
	}
}
