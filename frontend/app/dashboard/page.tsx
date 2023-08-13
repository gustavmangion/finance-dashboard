"use client";

import { useSession } from "next-auth/react";
import { useGetTestMessageQuery } from "../apis/base/test/testService";

export default function DashboardPage(): React.ReactNode {
	const { data: session } = useSession({
		required: true,
	});

	const { isLoading, isFetching, data, error } = useGetTestMessageQuery(null);
	if (!session) return null;
	return (
		<>
			<h2>This is your secure dashboard</h2>
			{error ? (
				<h3>Something went wrong</h3>
			) : isLoading || isFetching ? (
				<h3>Loading...</h3>
			) : data ? (
				<h3>{data.text}</h3>
			) : null}
		</>
	);
}
