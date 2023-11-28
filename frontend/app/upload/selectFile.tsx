import { Box, styled } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import styles from "../styles/upload.module.scss";
import { ChangeEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { dashboardApi } from "../apis/base/dashboard/dashboardService";
import { useDispatch } from "react-redux";
import { transactionApi } from "../apis/base/transaction/transactionService";
import { accountApi } from "../apis/base/account/accountService";

type Props = {
	setUploadFiles: (val: File[]) => void;
};

export default function SelectFile({ setUploadFiles }: Props) {
	const VisuallyHiddenInput = styled("input")`
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		bottom: 0;
		left: 0;
		white-space: nowrap;
		width: 1px;
	`;

	const [loading, setLoading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const dispatch = useDispatch();

	return (
		<div className={styles.upload}>
			<h3>Select the file/s you want to upload</h3>
			<Box className={materialStyles.buttonsContainer}>
				<LoadingButton variant="contained" component="label" loading={loading}>
					Upload
					<VisuallyHiddenInput
						type="file"
						accept="application/pdf"
						onChange={handleUploadFile}
						multiple
					/>
				</LoadingButton>
			</Box>
			{uploadError !== "" ? (
				<h4 className="errorMessage">{uploadError}</h4>
			) : null}
		</div>
	);

	function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
		setLoading(true);
		setUploadError("");
		if (e.target.files) {
			const files: File[] = Array.from(e.target.files);

			for (let file of files) {
				if (file.type !== "application/pdf") {
					setUploadError("File isn't a pdf");
					return;
				}
			}

			dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
			dispatch(transactionApi.util.invalidateTags(["transactions"]));
			dispatch(accountApi.util.invalidateTags(["accounts"]));
			setUploadFiles(files);
		} else setUploadError("File wasn't upload, please try again");
	}
}
