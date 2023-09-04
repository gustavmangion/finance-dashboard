import { Button, styled } from "@mui/material";
import MaterialStyles from "../styles/material.module.scss";
import styles from "../styles/upload.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { useUploadStatementMutation } from "../apis/base/upload/uploadService";
import { displayError } from "../stores/notificationSlice";
import { UploadStatementResponse } from "../apis/base/upload/types";
import UploadSuccessModal from "./uploadSuccessModal";
import UploadingSpinner from "./uploadingSpinner";

type Props = {
	setFormStep: (val: number) => void;
	setFileId: (val: string) => void;
	setAccountToBeSetup: (val: string[]) => void;
};

export default function SelectFile({
	setFormStep,
	setFileId,
	setAccountToBeSetup,
}: Props) {
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
	const [modalOpen, setModalOpen] = useState(false);

	const dispatch = useDispatch();
	const [uploadStatement] = useUploadStatementMutation();

	return (
		<div className={styles.upload}>
			{loading ? (
				<UploadingSpinner />
			) : (
				<>
					<h3>Select the file you want to upload</h3>

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
				</>
			)}
			<UploadSuccessModal
				modalOpen={modalOpen}
				setFormStep={setFormStep}
				setFileId={setFileId}
			/>
		</div>
	);

	function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
		setLoading(true);
		setUploadError("");
		if (e.target.files) {
			const file = e.target.files[0];
			if (file.type !== "application/pdf") setUploadError("File isn't a pdf");
			else
				uploadStatement(file).then((result) => {
					if ("data" in result) {
						const response: UploadStatementResponse = result.data;

						if (response.needPassword) {
							setFormStep(1);
							setFileId(response.uploadId);
						} else if (response.accountsToSetup.length > 0) {
							setFormStep(2);
							setFileId(response.uploadId);
							setAccountToBeSetup(response.accountsToSetup);
						} else setModalOpen(true);

						setLoading(false);
					} else dispatch(displayError("File wasn't upload, please try again"));
				});
		} else setUploadError("File wasn't upload, please try again");
	}
}
