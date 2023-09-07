import { CircularProgress } from "@mui/material";
import styles from "../styles/upload.module.scss";

export default function UploadingSpinner() {
	return (
		<div className={styles.spinner}>
			<h3>Processing your statement, Hang on...</h3>
			<CircularProgress />
		</div>
	);
}
