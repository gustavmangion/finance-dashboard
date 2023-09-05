import { Button, Modal } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { useRouter } from "next/navigation";

type Props = {
	modalOpen: boolean;
	multipleStatements: boolean;
	setModalOpen: (val: boolean) => void;
};

export default function UploadSuccessModal({
	modalOpen,
	multipleStatements,
	setModalOpen,
}: Props) {
	const router = useRouter();

	return (
		<Modal open={modalOpen} onClose={handleModalClose}>
			<div className={materialStyles.modal}>
				{multipleStatements ? (
					<h3>Your statements have been uploaded</h3>
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
		setModalOpen(false);
	}
}
