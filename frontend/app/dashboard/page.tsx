"use client";

import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import NumberCard from "./numberCard";
import {
	useGetHighestSpendByVendorQuery,
	useGetOverviewCardsQuery,
	useGetTotalByCardQuery,
} from "../apis/base/dashboard/dashboardService";
import { useAppSelector } from "../hooks/reduxHook";
import styles from "../styles/dashboard.module.scss";
import FilterPanel from "./filterPanel";
import dayjs from "dayjs";
import { FilterModel } from "../apis/base/dashboard/types";
import NameValueListCard from "./nameValueListCard";

export default function DashboardPage(): React.ReactNode {
	const router = useRouter();
	const baseCurrency: string | undefined = useAppSelector(
		(state) => state.userReducer.user?.baseCurrency
	);
	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	const initialFilterState = {
		from: dayjs(firstDayInPreviousMonth()),
		to: dayjs(lastDayInPreviousMonth()),
		portfolioId: "All",
	};
	const [filterState, setFilterState] = useState(initialFilterState);

	const filterModel = new FilterModel(
		baseCurrency!,
		filterState.from,
		filterState.to,
		filterState.portfolioId
	);

	const {
		isLoading: overviewIsLoading,
		isFetching: overviewIsFetching,
		data: overviewData,
	} = useGetOverviewCardsQuery({
		...filterModel,
	});
	const {
		isLoading: cardTotalIsLoading,
		isFetching: cardTotalIsFetching,
		data: cardTotalData,
	} = useGetTotalByCardQuery({
		...filterModel,
	});
	const {
		isLoading: highVenSpendIsLoading,
		isFetching: highVenSpendIsFetching,
		data: highVenSpendData,
	} = useGetHighestSpendByVendorQuery({ ...filterModel });

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
					resetFilterState={resetFilterState}
				/>
				<div className={styles.mainCardLayout}>
					<NumberCard
						title="Total"
						loading={overviewIsLoading || overviewIsFetching}
						current={overviewData === undefined ? NaN : overviewData[0].current}
						previous={
							overviewData === undefined ? NaN : overviewData![0].previous
						}
					/>
					<NumberCard
						title="Credit"
						loading={overviewIsLoading || overviewIsFetching}
						current={
							overviewData === undefined ? NaN : overviewData![1].current
						}
						previous={
							overviewData === undefined ? NaN : overviewData![1].previous
						}
						noData={
							overviewData !== undefined &&
							overviewData[1].current === 0 &&
							overviewData[2].current === 0
						}
					/>
					<NumberCard
						title="Debit"
						loading={overviewIsLoading || overviewIsFetching}
						current={
							overviewData === undefined ? NaN : overviewData![2].current
						}
						previous={
							overviewData === undefined ? NaN : overviewData![2].previous
						}
						inverseTrend
						noData={
							overviewData !== undefined &&
							overviewData[1].current === 0 &&
							overviewData[2].current === 0
						}
					/>
					<NumberCard
						title="Savings"
						loading={overviewIsLoading || overviewIsFetching}
						current={
							overviewData === undefined
								? NaN
								: (overviewData![1].current - overviewData[2].current) /
								  overviewData[1].current
						}
						previous={
							overviewData === undefined
								? NaN
								: (overviewData![1].previous - overviewData[2].previous) /
								  overviewData[1].previous
						}
						percentage
						noData={
							overviewData !== undefined &&
							overviewData[1].current === 0 &&
							overviewData[2].current === 0
						}
					/>
				</div>
				<div className={styles.cardLayout}>
					<NameValueListCard
						title="Spend by Card"
						loading={cardTotalIsLoading || cardTotalIsFetching}
						data={cardTotalData}
					/>
					<NameValueListCard
						title="Top Spend"
						loading={highVenSpendIsLoading || highVenSpendIsFetching}
						data={highVenSpendData}
						width={2}
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

	function resetFilterState() {
		setFilterState(initialFilterState);
	}
}
