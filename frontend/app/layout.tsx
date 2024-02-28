import "./styles/globals.scss";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "./components/provider";
import Navbar from "./components/navbar";
import React from "react";
import Footer from "./components/footer";
import Notification from "./components/notification";

const inter = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "QazQuz - Finance Dashboard",
	description: "Insight into your personal funds",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body className={inter.className}>
				<Providers>
					<Notification />
					<Navbar />
					<main>{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
