import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import styles from "../styles/dashboard.module.scss";

export default function LoadError() {
	return (
		<div className={styles.loadError}>
			<RunningWithErrorsIcon />
			<small>Unable to load</small>
		</div>
	);
}
