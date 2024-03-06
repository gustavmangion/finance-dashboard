"use client";

import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import NumberCard from "./numberCard";
import {
	useGetExpenseBreakdownQuery,
	useGetExpenseByDateQuery,
	useGetHighestSpendByVendorQuery,
	useGetOverviewCardsQuery,
	useGetTotalByCardQuery,
	useLazyGetCardTransactionsQuery,
} from "../apis/base/dashboard/dashboardService";
import { useAppSelector } from "../hooks/reduxHook";
import styles from "../styles/dashboard.module.scss";
import FilterPanel from "./filterPanel";
import dayjs from "dayjs";
import { FilterModel } from "../apis/base/dashboard/types";
import NameValueListCard from "./nameValueListCard";
import DonutCard from "./donutCard";
import LineCard from "./lineCard";
import Transaction from "../apis/base/transaction/types";
import TransactionListModal from "./drilldown/transactionListModal";

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

	const [transactionDrillDownState, setTransactionDrillDownState] = useState({
		open: false,
		title: "",
		loading: false,
		data: [] as Transaction[] | undefined,
	});

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
	const {
		isLoading: expBrkIsLoading,
		isFetching: expBrkIsFetching,
		data: expBrkData,
	} = useGetExpenseBreakdownQuery({ ...filterModel });
	const {
		isLoading: expDateIsLoading,
		isFetching: expDateIsFetching,
		data: expDateData,
	} = useGetExpenseByDateQuery({ ...filterModel });

	const [cardTransTrigger, cardTransResult] = useLazyGetCardTransactionsQuery();
	useEffect(() => {
		if (cardTransResult && cardTransResult.data)
			setTransactionDrillDownState((state) => ({
				...state,
				data: cardTransResult.data,
				loading: cardTransResult.isLoading || cardTransResult.isFetching,
			}));
	}, [cardTransResult]);

	const authStatus = useSecurePage();
	useEffect(() => {
		if (authStatus === AuthStatus.NotAuthorized) router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized) {
		return (
			<div className="container">
				<div>
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
							current={
								overviewData === undefined ? NaN : overviewData[0].current
							}
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
							drillDown
							drillDownAction={(id) => showCardDrillDown(id)}
						/>
						<NameValueListCard
							title="Top Spend"
							loading={highVenSpendIsLoading || highVenSpendIsFetching}
							data={highVenSpendData}
							width={2}
							showCount
						/>
					</div>
					<div className={styles.cardLayout}>
						<DonutCard
							title="Expenses"
							loading={expBrkIsLoading || expBrkIsFetching}
							data={expBrkData}
						/>
						<LineCard
							title="Expenses by Date"
							loading={expDateIsLoading || expDateIsFetching}
							data={expDateData}
						/>
					</div>
				</div>
				{transactionDrillDownState ? (
					<TransactionListModal
						open={transactionDrillDownState.open}
						title={transactionDrillDownState.title}
						data={transactionDrillDownState.data}
						loading={transactionDrillDownState.loading}
						setOpen={closeTransactionDrillDownModal}
					/>
				) : null}
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

	function closeTransactionDrillDownModal() {
		setTransactionDrillDownState({
			open: false,
			data: [],
			title: "",
			loading: false,
		});
	}

	async function showCardDrillDown(id: string) {
		const filterModel = new FilterModel(
			baseCurrency!,
			filterState.from,
			filterState.to,
			filterState.portfolioId,
			id
		);

		cardTransTrigger({ ...filterModel });
		setTransactionDrillDownState({
			open: true,
			title: `Transactions for Card ${id}`,
			loading: true,
			data: cardTransResult.data,
		});
	}
}
