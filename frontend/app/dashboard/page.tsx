"use client";

import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import NumberCard from "./card";
import { useGetOverviewCardsQuery } from "../apis/base/dashboard/dashboardService";
import { useAppSelector } from "../hooks/reduxHook";

export default function DashboardPage(): React.ReactNode {
	const router = useRouter();
	const baseCurrency: string | undefined = useAppSelector(
		(state) => state.userReducer.user?.baseCurrency
	);

	const { isLoading, isFetching, data } = useGetOverviewCardsQuery(
		baseCurrency!
	);
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
					loading={isLoading || isFetching}
					current={data === undefined ? NaN : data[0].current}
					previous={data === undefined ? NaN : data![0].previous}
				/>
				<NumberCard
					title="Credit"
					loading={isLoading || isFetching}
					current={data === undefined ? NaN : data![1].current}
					previous={data === undefined ? NaN : data![1].previous}
				/>
				<NumberCard
					title="Debit"
					loading={isLoading || isFetching}
					current={data === undefined ? NaN : data![2].current}
					previous={data === undefined ? NaN : data![2].previous}
					inverseTrend
				/>
			</div>
		);
}
