import { Button, styled } from "@mui/material";
import MaterialStyles from "../styles/material.module.scss";
import styles from "../styles/upload.module.scss";
import { ChangeEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { useUploadStatementMutation } from "../apis/base/upload/uploadService";

export default function SelectFile() {
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
	const [uploadStatement] = useUploadStatementMutation();

	return (
		<div className={styles.upload}>
			{loading ? (
				<h3>Processing your statement, Hang on...</h3>
			) : (
				<h3>Select the file you want to upload</h3>
			)}

			<LoadingButton
				className={MaterialStyles.primaryButton}
				component="label"
				loading={loading}
			>
				Upload
				<VisuallyHiddenInput
					type="file"
					accept="application/pdf"
					onChange={handleUploadFile}
				/>
			</LoadingButton>
			{uploadError !== "" ? (
				<h4 className={styles.errorMessage}>{uploadError}</h4>
			) : null}
		</div>
	);

	function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
		setLoading(true);
		if (e.target.files) {
			const file = e.target.files[0];
			console.log(file.type);
			console.log(file);
			if (file.type !== "application/pdf") setUploadError("File isn't a pdf");
			else uploadStatement(file).then((response) => console.log(response));
		} else setUploadError("File wasn't upload, please try again");

		setLoading(false);
	}
}
