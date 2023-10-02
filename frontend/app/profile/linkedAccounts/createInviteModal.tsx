import { Alert, Box, Button, Modal, Paper, TextField } from "@mui/material";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { CreateUserShare, UserShare } from "@/app/apis/base/user/types";
import {
	useAddUserShareMutation,
	userApi,
} from "@/app/apis/base/user/userService";
import { useDispatch } from "react-redux";
import { displayError } from "@/app/stores/notificationSlice";

type Props = {
	modalOpen: boolean;
	setModalOpen: (value: boolean) => void;
};

export default function CreateInviteModal({ modalOpen, setModalOpen }: Props) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [inviteCode, setInviteCode] = useState("");
	const [nameExists, setNameExists] = useState(false);

	const dispatch = useDispatch();
	const [createInvite] = useAddUserShareMutation();

	return (
		<Modal open={modalOpen} onClose={handleClose}>
			<Paper className={materialStyles.modal}>
				{inviteCode === "" ? (
					<>
						<h3>Create invite</h3>
						<form onSubmit={handleSubmit}>
							<TextField
								name="name"
								label="Sharing with"
								variant="standard"
								onChange={handleChange}
								value={name}
								inputProps={{ maxLength: 45 }}
								required
							/>
							<p>Enter a friendly name to identify this invite</p>
							{nameExists ? (
								<Alert severity="error">Name already used</Alert>
							) : null}
							<Box className={materialStyles.buttonsContainer}>
								<LoadingButton
									loading={loading}
									variant="contained"
									type="submit"
								>
									Create
								</LoadingButton>
								<Button variant="outlined" onClick={handleClose}>
									Cancel
								</Button>
							</Box>
						</form>
					</>
				) : (
					<>
						<h3>Invite Created</h3>
						<p>
							Share this invite number: {inviteCode}, along with your share code
							to link another account
						</p>
						<p>Link will be valid for 30 days</p>
						<Box className={materialStyles.buttonsContainer}>
							<Button variant="outlined" onClick={handleSuccessClose}>
								Close
							</Button>
						</Box>
					</>
				)}
			</Paper>
		</Modal>
	);

	function handleSuccessClose() {
		dispatch(userApi.util.invalidateTags(["UserShare"]));
		handleClose();
	}

	function handleClose() {
		setName("");
		setInviteCode("");
		setModalOpen(false);
		setNameExists(false);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
		setNameExists(false);
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		if (nameExists) return;

		setLoading(true);

		const model: CreateUserShare = new CreateUserShare();
		model.alias = name.trim();

		createInvite(model).then((result) => {
			setLoading(false);

			if ("data" in result) {
				const userShare: UserShare = result.data;
				setInviteCode(userShare.inviteCode);
			} else if ("error" in result) {
				if (
					"data" in result.error &&
					result.error.data === "Alias already exists"
				) {
					setNameExists(true);
				} else dispatch(displayError(null));
			} else dispatch(displayError(null));
		});
	}
}
