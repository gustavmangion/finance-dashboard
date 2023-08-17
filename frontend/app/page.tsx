"use client";

import { useSession } from "next-auth/react";
import materialStyles from "./styles/material.module.scss";
import styles from "./styles/public.module.scss";
import { Button } from "@mui/material";

export default function Home() {
	const session = useSession();

	return (
		<div className={styles.homePage}>
			<div className={styles.frosted}>
				<h1>Take control of your finances</h1>
			</div>
			<div className={styles.frosted}>
				<h2>
					Get insight into your spending straight from your bank statements
				</h2>
				<h3>...and some other financial planning goodies</h3>
			</div>
			<div className={styles.callOut}>
				<Button className={styles.homeSignIn}>Let&apos;s Go!</Button>
				<h4 className={styles.frosted}>
					If you do not have an account yet, we will set one up after you sign
					in
				</h4>
			</div>
		</div>
	);
}
