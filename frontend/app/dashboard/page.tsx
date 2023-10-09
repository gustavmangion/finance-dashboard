"use client";

import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useEffect } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import NumberCard from "./card";
import { useGetOverviewTotalQuery } from "../apis/base/dashboard/dashboardService";

export default function DashboardPage(): React.ReactNode {
	const router = useRouter();

	const { isLoading, isFetching, data } = useGetOverviewTotalQuery("EUR");
	const authStatus = useSecurePage();
	useEffect(() => {
		if (authStatus === AuthStatus.NotAuthorized) router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				<h2>My Dashboard</h2>
				<NumberCard
					title="Total"
					current={data?.current}
					previous={data?.previous}
				/>
			</div>
		);
}
