import { styled } from "@mui/material";
import MaterialStyles from "../styles/material.module.scss";
import styles from "../styles/upload.module.scss";
import { ChangeEvent, useState } from "react";
import { LoadingButton } from "@mui/lab";

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

	return (
		<div className={styles.upload}>
			<h3>Select the file/s you want to upload</h3>

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
					multiple
				/>
			</LoadingButton>
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

			setUploadFiles(files);
		} else setUploadError("File wasn't upload, please try again");
	}
}
