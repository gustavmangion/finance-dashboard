import { Button } from "@mui/material";
import materialStyles from "../../styles/material.module.scss";
import styles from "../../styles/home.module.scss";
import { useRouter } from "next/navigation";

export default function HomeMenu() {
	const router = useRouter();

	return (
		<div className={styles.buttonMenu}>
			<Button
				className={materialStyles.primaryButton}
				onClick={() => router.push("/dashboard")}
			>
				My Dashboard
			</Button>
			<Button
				className={materialStyles.primaryButton}
				onClick={() => router.push("/upload")}
			>
				Upload E-Statement
			</Button>
			<Button className={materialStyles.primaryButton}>Statement Viewer</Button>
		</div>
	);
}
