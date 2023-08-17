import { Button } from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import materialStyles from "../styles/material.module.scss";
import Image from "next/image";

export default function SignedInHome() {
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
				<Button className={materialStyles.primaryButton}>My Dashboard</Button>
				<Button className={materialStyles.primaryButton}>
					Upload E-Statement
				</Button>
				<Button className={materialStyles.primaryButton}>
					Statement Viewer
				</Button>
			</div>
		</div>
	);
}
