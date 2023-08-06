"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { signIn } from "next-auth/react";
import Login from "./login";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>Your finance dashboard</div>
			<Login />
		</main>
	);
}
