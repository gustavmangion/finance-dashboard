import { Box, Button, Modal, Paper } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { useRouter } from "next/navigation";

type Props = {
	modalOpen: boolean;
	multipleStatements: boolean;
	statementAlreadyUploaded: boolean;
	uploadError: boolean;
	reset: () => void;
};

export default function UploadSuccessModal({
	modalOpen,
	multipleStatements,
	statementAlreadyUploaded,
	uploadError,
	reset,
}: Props) {
	const router = useRouter();

	return (
		<Modal open={modalOpen} onClose={handleModalClose}>
			<Paper className={materialStyles.modal}>
				{uploadError
					? getUploadErrorText()
					: statementAlreadyUploaded
					? getAlreadyUploadedText()
					: getUploadedText()}
				<Box className={materialStyles.buttonsContainer}>
					<Button variant="contained" onClick={handleModalClose}>
						Continue
					</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleUploadAnotherStatement}
					>
						Upload more
					</Button>
				</Box>
			</Paper>
		</Modal>
	);

	function getUploadErrorText() {
		if (multipleStatements)
			return (
				<h3>
					Some or all of your statements weren&apos;t uploaded due to an error
				</h3>
			);

		return <h3>Your statement wasn&apos;t uploaded due to an error</h3>;
	}

	function getAlreadyUploadedText() {
		if (multipleStatements)
			return (
				<>
					<h3>Your statements have been uploaded</h3>
					<p>
						Some of your statements where already uploaded and have been ignored
					</p>
				</>
			);

		return (
			<h3>Statement wasn&apos;t uploaded as it was previously uploaded</h3>
		);
	}

	function getUploadedText() {
		if (multipleStatements) return <h3>Your statements have been uploaded</h3>;

		return <h3>Your statement has been uploaded</h3>;
	}

	function handleModalClose() {
		router.push("/");
	}

	function handleUploadAnotherStatement() {
		reset();
	}
}
