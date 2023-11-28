import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "../styles/dashboard.module.scss";

export default function LoadError() {
	return (
		<div className={styles.loadError}>
			<ErrorOutlineIcon />
			<small>Unable to load</small>
		</div>
	);
}
