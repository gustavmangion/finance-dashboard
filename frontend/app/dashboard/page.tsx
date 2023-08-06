"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
	const { data: session } = useSession({
		required: true,
	});

	return (
		<>
			<h2>This is your secure dashboard</h2>
		</>
	);
}
