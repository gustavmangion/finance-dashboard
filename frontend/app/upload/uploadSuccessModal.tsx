import { Button, Modal } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { useRouter } from "next/navigation";

type Props = {
	modalOpen: boolean;
	multipleStatements: boolean;
	statementAlreadyUploaded: boolean;
	reset: () => void;
};

export default function UploadSuccessModal({
	modalOpen,
	multipleStatements,
	statementAlreadyUploaded,
	reset,
}: Props) {
	const router = useRouter();

	return (
		<Modal open={modalOpen} onClose={handleModalClose}>
			<div className={materialStyles.modal}>
				{multipleStatements ? (
					<>
						<h3>Your statements have been uploaded</h3>
						{statementAlreadyUploaded ? (
							<p>
								Some of your statements where already uploaded and have been
								ignored
							</p>
						) : null}
					</>
				) : statementAlreadyUploaded ? (
					<h3>Statement wasn&apos;t uploaded as it was previously uploaded</h3>
				) : (
					<h3>Your statement has been uploaded</h3>
				)}

				<Button
					className={materialStyles.primaryButton}
					onClick={handleModalClose}
				>
					Continue
				</Button>
				<Button
					className={materialStyles.primaryButton}
					onClick={handleUploadAnotherStatement}
				>
					Upload more
				</Button>
			</div>
		</Modal>
	);

	function handleModalClose() {
		router.push("/");
	}

	function handleUploadAnotherStatement() {
		reset();
	}
}
