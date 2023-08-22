"use client";

import { useRouter } from "next/navigation";
import { useGetTestMessageQuery } from "../apis/base/test/testService";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useEffect } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";

export default function DashboardPage(): React.ReactNode {
	const { isLoading, isFetching, data, error } = useGetTestMessageQuery(null);
	const router = useRouter();

	const authStatus = useSecurePage();
	useEffect(() => {
		if (authStatus === AuthStatus.NotAuthorized) router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
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
