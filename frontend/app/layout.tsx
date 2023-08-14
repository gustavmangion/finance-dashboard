import "./styles/globals.scss";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Providers from "./components/provider";
import Navbar from "./components/navbar";

const inter = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Finance Dashboard",
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
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
