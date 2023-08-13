"use client";

import styles from "./page.module.css";
import Login from "./login";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>Your finance dashboard</div>
			<Login />
		</main>
	);
}
