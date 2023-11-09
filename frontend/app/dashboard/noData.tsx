import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import styles from "../styles/dashboard.module.scss";

export default function NoData() {
	return (
		<div className={styles.noData}>
			<RunningWithErrorsIcon />
			<small>No Data</small>
		</div>
	);
}
