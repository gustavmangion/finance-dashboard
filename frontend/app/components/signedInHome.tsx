import { Button } from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import materialStyles from "../styles/material.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignedInHome() {
	const router = useRouter();

	return (
		<div className="container">
			<div className={styles.homeHeader}>
				<h1>
					Welcome to QasQuz
					<Image
						src="/logo.png"
						alt="logo"
						width={0}
						height={0}
						sizes="100%"
						style={{ width: "auto", height: "100%" }}
					/>
				</h1>
				<h2>Your smart piggy bank assistant</h2>
			</div>
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
				<Button className={materialStyles.primaryButton}>
					Statement Viewer
				</Button>
			</div>
		</div>
	);
}
