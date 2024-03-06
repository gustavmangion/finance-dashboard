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
	useLazyGetHighestSpendByVendorQuery,
	useLazyGetVendorTransactionsQuery,
} from "../apis/base/dashboard/dashboardService";
import { useAppSelector } from "../hooks/reduxHook";
import styles from "../styles/dashboard.module.scss";
import FilterPanel from "./filterPanel";
import dayjs from "dayjs";
import { FilterModel, NameValueModel } from "../apis/base/dashboard/types";
import NameValueListCard from "./nameValueListCard";
import DonutCard from "./donutCard";
import LineCard from "./lineCard";
import Transaction from "../apis/base/transaction/types";
import TransactionListModal from "./drilldown/transactionListModal";
import NameValueListModal from "./drilldown/nameValueListModal";

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

	const [nameValueDrillDownState, setNameValueDrillDownState] = useState({
		open: false,
		title: "",
		loading: false,
		data: [] as NameValueModel[] | undefined,
		showCount: false,
		drillDownSource: "",
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

	const [vendorTransTrigger, vendorTransResult] =
		useLazyGetVendorTransactionsQuery();
	useEffect(() => {
		if (vendorTransResult && vendorTransResult.data)
			setTransactionDrillDownState((state) => ({
				...state,
				data: vendorTransResult.data,
				loading: vendorTransResult.isLoading || vendorTransResult.isFetching,
			}));
	}, [vendorTransResult]);

	const [categoryTransTrigger, categoryTransResult] =
		useLazyGetHighestSpendByVendorQuery();
	useEffect(() => {
		if (categoryTransResult && categoryTransResult.data)
			setNameValueDrillDownState((state) => ({
				...state,
				data: categoryTransResult.data,
				loading:
					categoryTransResult.isLoading || categoryTransResult.isFetching,
			}));
	}, [categoryTransResult]);

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
							drillDownAction={(id) => doDrillDown(id, "cardTrans")}
						/>
						<NameValueListCard
							title="Top Spend"
							loading={highVenSpendIsLoading || highVenSpendIsFetching}
							data={highVenSpendData}
							width={2}
							showCount
							drillDownAction={(id) => doDrillDown(id, "vendorTrans")}
						/>
					</div>
					<div className={styles.cardLayout}>
						<DonutCard
							title="Expenses"
							loading={expBrkIsLoading || expBrkIsFetching}
							data={expBrkData}
							drillDownAction={(id) => doDrillDown(id, "expenseCategory")}
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
				{nameValueDrillDownState ? (
					<NameValueListModal
						open={nameValueDrillDownState.open}
						title={nameValueDrillDownState.title}
						data={nameValueDrillDownState.data}
						loading={nameValueDrillDownState.loading}
						showCount={nameValueDrillDownState.showCount}
						source={nameValueDrillDownState.drillDownSource}
						setOpen={closeNameValueDrillDownModal}
						drillDownAction={(id, source) => doDrillDown(id, source)}
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

	function closeNameValueDrillDownModal() {
		setNameValueDrillDownState({
			open: false,
			data: [],
			title: "",
			loading: false,
			showCount: false,
			drillDownSource: "",
		});
	}

	function doDrillDown(id: string, type: string) {
		const filterModel = new FilterModel(
			baseCurrency!,
			filterState.from,
			filterState.to,
			filterState.portfolioId,
			id
		);

		var data: Transaction[] | NameValueModel[] | undefined = undefined;
		var dataType = "";
		var title: string = "";
		var showCount: boolean = false;
		var drillDownSource: string = "";

		switch (type) {
			case "cardTrans":
				cardTransTrigger({ ...filterModel });
				title = `Transactions for Card ${id}`;
				data = cardTransResult.data;
				dataType = "trans";
				break;
			case "vendorTrans":
				vendorTransTrigger({ ...filterModel });
				title = `Transactions for ${id}`;
				data = vendorTransResult.data;
				dataType = "trans";
				break;
			case "expenseCategory":
				categoryTransTrigger({ ...filterModel });
				title = ` ${id} Transactions`;
				data = categoryTransResult.data;
				dataType = "nameValue";
				showCount = true;
				drillDownSource = "vendorTrans";
				break;
			default:
				throw new Error("Missing or invalid drill down type");
		}

		if (dataType === "trans")
			setTransactionDrillDownState({
				open: true,
				title: title,
				loading: true,
				data: data as Transaction[],
			});
		else if (dataType === "nameValue") {
			setNameValueDrillDownState({
				open: true,
				title: title,
				loading: true,
				data: categoryTransResult.data,
				showCount: showCount,
				drillDownSource: drillDownSource,
			});
		}
	}
}
