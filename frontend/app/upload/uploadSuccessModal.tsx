import { Button, Modal } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import { useRouter } from "next/navigation";

type Props = {
	modalOpen: boolean;
	formStep: number;
	setFormStep: (val: number) => void;
	setFileId: (val: string) => void;
};

export default function UploadSuccessModal({
	modalOpen,
	formStep,
	setFormStep,
	setFileId,
}: Props) {
	const router = useRouter();

	return (
		<Modal open={modalOpen} onClose={handleModalClose}>
			<div className={materialStyles.modal}>
				<p>Your statement is being processed and will be available shortly</p>
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
					Upload another
				</Button>
			</div>
		</Modal>
	);

	function handleModalClose() {
		router.push("/");
	}

	function handleUploadAnotherStatement() {
		setFileId("");
		setFormStep(formStep + 1);
	}
}
