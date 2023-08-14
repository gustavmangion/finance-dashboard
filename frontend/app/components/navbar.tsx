"use client";

import Image from "next/image";
import styles from "../styles/navbar.module.scss";
import { useSession } from "next-auth/react";

export default function Navbar() {
	const { data: session } = useSession();
	if (session)
		return (
			<div className={styles.navbar}>
				<div>
					<h1>Your Finance Dashboard</h1>
				</div>
				<div className={styles.avatar}>
					<Image
						src={session.user?.image as string}
						alt="User avatar"
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>
		);
	else {
		return (
			<div className="navbar">
				<div>
					<h1>Your Finance Dashboard</h1>
				</div>
				<div>Not Logged In</div>
			</div>
		);
	}
}
