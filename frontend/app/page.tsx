"use client";

import styles from "./page.module.css";
import Login from "./login";
import Link from "next/link";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>Your finance dashboard</div>
			<Login />
			<Link href="/dashboard">Dashboard</Link>
		</main>
	);
}
