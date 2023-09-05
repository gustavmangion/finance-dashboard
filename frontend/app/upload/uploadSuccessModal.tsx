import { Button, Modal } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { useRouter } from "next/navigation";

type Props = {
	modalOpen: boolean;
	multipleStatements: boolean;
	reset: () => void;
};

export default function UploadSuccessModal({
	modalOpen,
	multipleStatements,
	reset,
}: Props) {
	const router = useRouter();

	return (
		<Modal open={modalOpen} onClose={handleModalClose}>
			<div className={materialStyles.modal}>
				{multipleStatements ? (
					<p>Your statements have been uploaded</p>
				) : (
					<p>Your statement has been uploaded</p>
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
		reset();
		router.push("/");
	}

	function handleUploadAnotherStatement() {
		reset();
	}
}
