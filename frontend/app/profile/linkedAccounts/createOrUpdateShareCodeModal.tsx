import { Box, Button, Modal, Paper, TextField } from "@mui/material";
import materialStyles from "../../styles/material.module.scss";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
	useAddOrUpdateUserShareCodeMutation,
	userApi,
} from "@/app/apis/base/user/userService";
import { CreateUserShareCode } from "@/app/apis/base/user/types";
import { useDispatch } from "react-redux";
import { displayError, displaySuccess } from "@/app/stores/notificationSlice";

type Props = {
	modalOpen: boolean;
	newCode: boolean;
	setModalOpen: (value: boolean) => void;
};

export default function CreateOrUpdateShareCodeModal({
	modalOpen,
	newCode,
	setModalOpen,
}: Props) {
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const [createOrUpdateCode] = useAddOrUpdateUserShareCodeMutation();

	return (
		<Modal open={modalOpen} onClose={handleClose}>
			<Paper className={materialStyles.modal}>
				<h3>Set a share code</h3>
				<h4>This code needs to be shared with account you will be linking</h4>
				<form onSubmit={handleSubmit}>
					<TextField
						name="code"
						label="Share Code"
						variant="standard"
						type="password"
						onChange={handleChange}
						value={code}
						inputProps={{ minLength: 6, maxLength: 15 }}
						required
					/>
					<p>Code needs to be between 6 to 15 characters</p>
					<Box className={materialStyles.buttonsContainer}>
						<LoadingButton loading={loading} variant="contained" type="submit">
							Save
						</LoadingButton>
						<Button variant="outlined" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
					</Box>
				</form>
			</Paper>
		</Modal>
	);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setCode(e.target.value);
	}

	function handleClose() {
		setCode("");
		setModalOpen(false);
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const model: CreateUserShareCode = new CreateUserShareCode();
		model.code = code;

		createOrUpdateCode(model).then((result) => {
			if ("data" in result) {
				dispatch(displaySuccess("Share code updated"));
				setLoading(false);
				setCode("");
				if (newCode) {
					dispatch(userApi.util.invalidateTags(["UserShare"]));
				}
				setModalOpen(false);
			} else dispatch(displayError(null));
		});
	}
}
