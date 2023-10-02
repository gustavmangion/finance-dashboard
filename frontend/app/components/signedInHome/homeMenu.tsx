import { Button, Paper } from "@mui/material";
import styles from "../../styles/home.module.scss";
import { useRouter } from "next/navigation";

export default function HomeMenu() {
	const router = useRouter();

	return (
		<Paper className={styles.buttonMenu}>
			<Button variant="contained" onClick={() => router.push("/dashboard")}>
				My Dashboard
			</Button>
			<Button variant="contained" onClick={() => router.push("/upload")}>
				Upload Statement
			</Button>
			<Button variant="contained" onClick={() => router.push("/accounts")}>
				Accounts
			</Button>
		</Paper>
	);
}
