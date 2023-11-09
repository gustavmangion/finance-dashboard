"use client";

import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import NumberCard from "./numberCard";
import { useGetOverviewCardsQuery } from "../apis/base/dashboard/dashboardService";
import { useAppSelector } from "../hooks/reduxHook";
import styles from "../styles/dashboard.module.scss";
import FilterPanel from "./filterPanel";
import dayjs from "dayjs";
import { FilterModel } from "../apis/base/dashboard/types";

export default function DashboardPage(): React.ReactNode {
	const router = useRouter();
	const baseCurrency: string | undefined = useAppSelector(
		(state) => state.userReducer.user?.baseCurrency
	);
	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	const [filterState, setFilterState] = useState({
		from: dayjs(firstDayInPreviousMonth()),
		to: dayjs(lastDayInPreviousMonth()),
		portfolioId: "All",
	});
	const filterModel = new FilterModel(
		baseCurrency!,
		filterState.from,
		filterState.to,
		filterState.portfolioId
	);

	const { isLoading, isFetching, data } = useGetOverviewCardsQuery({
		...filterModel,
	});
	const authStatus = useSecurePage();
	useEffect(() => {
		if (authStatus === AuthStatus.NotAuthorized) router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized) {
		return (
			<div className="container">
				<h2>My Dashboard</h2>
				<h4>All values in base currency {baseCurrency}</h4>
				<FilterPanel
					filterState={filterState}
					portfolios={portfolios}
					setFilterState={setFilterState}
				/>
				<div className={styles.mainCardLayout}>
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
						noData={
							data !== undefined &&
							data[1].current === 0 &&
							data[2].current === 0
						}
					/>
					<NumberCard
						title="Debit"
						loading={isLoading || isFetching}
						current={data === undefined ? NaN : data![2].current}
						previous={data === undefined ? NaN : data![2].previous}
						inverseTrend
						noData={
							data !== undefined &&
							data[1].current === 0 &&
							data[2].current === 0
						}
					/>
					<NumberCard
						title="Savings"
						loading={isLoading || isFetching}
						current={
							data === undefined
								? NaN
								: (data![1].current - data[2].current) / data[2].current
						}
						previous={
							data === undefined
								? NaN
								: (data![1].previous - data[2].previous) / data[2].previous
						}
						percentage
						noData={
							data !== undefined &&
							data[1].current === 0 &&
							data[2].current === 0
						}
					/>
				</div>
			</div>
		);
	}

	function firstDayInPreviousMonth() {
		var date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();
		return new Date(y, m - 1, 1);
	}

	function lastDayInPreviousMonth() {
		var date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();
		return new Date(y, m, 0);
	}
}
