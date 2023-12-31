import {
	Alert,
	Button,
	LinearProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import Account from "../apis/base/account/types";
import { useGetTransactionsQuery } from "../apis/base/transaction/transactionService";
import { PageView } from "./pageViewEnum";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useState } from "react";
import styles from "../styles/account.module.scss";
import materialStyles from "../styles/material.module.scss";
import React from "react";
import { getMoneyFormat } from "../helpers/moneyHelper";
import { getCategoryFromId } from "../helpers/transactionHelper";
import TransactionsListFilter from "./transactionsListFilter";
import Transaction, {
	TransactionParameters,
} from "../apis/base/transaction/types";

type Props = {
	account: Account;
	setView: (val: PageView) => void;
};

export default function TransactionsList({ account, setView }: Props) {
	const [searchParameters, setSearchParameters] = useState(
		new TransactionParameters(account.id)
	);
	let rowsPerPageOptions: number[] = [];

	if (window.innerWidth > 500) rowsPerPageOptions = [5, 10, 20, 50];

	const {
		isLoading,
		isFetching,
		data: searchMeta,
	} = useGetTransactionsQuery({
		...searchParameters,
	});

	if (isLoading) return <LoadingSkeleton />;

	return (
		<>
			<h2 className={styles.transactionsListTitle}>
				Transactions for {account.name}
			</h2>
			<TransactionsListFilter
				searchParameters={searchParameters}
				setSearchParameters={setSearchParameters}
			/>
			<Paper className={styles.tablePagination}>
				<TablePagination
					rowsPerPageOptions={rowsPerPageOptions}
					component="div"
					count={searchMeta!.totalCount}
					page={searchMeta!.currentPage}
					rowsPerPage={searchMeta!.pageSize}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleChangeRowsPerPage}
					showFirstButton
				/>
			</Paper>
			<Paper className={styles.transactionsTable}>
				<TableContainer className={styles.tableContainer}>
					<Table stickyHeader size="small">
						<TableHead>
							<TableRow>
								<TableCell className={styles.normalColumn}>Date</TableCell>
								<TableCell className={styles.normalColumn}>Category</TableCell>
								<TableCell className={styles.wideColumn}>Description</TableCell>
								<TableCell className={styles.normalColumn}>Card</TableCell>
								<TableCell className={styles.normalColumn}>Reference</TableCell>
								<TableCell className={styles.normalColumn}>Amount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isFetching ? getLoadingRows() : getTableRows()}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<Button className={materialStyles.backButton} onClick={handleBack}>
				Back
			</Button>
		</>
	);

	function handlePageChange(event: unknown, newPage: number) {
		setSearchParameters({
			...searchParameters,
			currentPage: newPage,
		});
	}

	function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchParameters({
			...searchParameters,
			currentPage: 0,
			pageSize: parseInt(event.target.value, 10),
		});
	}

	function getTableRows() {
		const rows = [];
		const transactions: Transaction[] = searchMeta!.data;

		for (let i = 0; i < searchParameters.pageSize; i++) {
			if (transactions.length === 0 && i === 0) rows.push(getNoDataRow());
			else if (i < transactions.length) {
				rows.push(getDataRow(transactions[i]));
			} else rows.push(getEmptyRow(i));
		}
		return rows;
	}

	function getDataRow(transaction: Transaction) {
		return (
			<TableRow
				key={transaction.id}
				className={transaction.amount < 0 ? styles.debit : styles.credit}
			>
				<TableCell className={styles.normalColumn}>
					{transaction.tranDate}
				</TableCell>
				<TableCell className={styles.normalColumn}>
					{getCategoryFromId(transaction.category)}
				</TableCell>
				<TableCell className={styles.wideColumn}>
					{transaction.description}
				</TableCell>
				<TableCell className={styles.normalColumn}>
					{transaction.cardNo}
				</TableCell>
				<TableCell className={styles.normalColumn}>
					{transaction.reference}
				</TableCell>
				<TableCell className={styles.normalColumn}>
					{getMoneyFormat(transaction.amount)}
				</TableCell>
			</TableRow>
		);
	}

	function getEmptyRow(key: number) {
		return (
			<TableRow key={key}>
				<TableCell className={styles.normalColumn}>---</TableCell>
				<TableCell className={styles.normalColumn}>
					<LinearProgress color="inherit" variant="determinate" value={0} />
				</TableCell>
				<TableCell className={styles.wideColumn}>
					<LinearProgress color="inherit" variant="determinate" value={0} />
				</TableCell>
				<TableCell className={styles.normalColumn}>
					<LinearProgress color="inherit" variant="determinate" value={0} />
				</TableCell>
				<TableCell className={styles.normalColumn}>
					<LinearProgress color="inherit" variant="determinate" value={0} />
				</TableCell>
				<TableCell className={styles.normalColumn}>
					<LinearProgress color="inherit" variant="determinate" value={0} />
				</TableCell>
			</TableRow>
		);
	}

	function getNoDataRow() {
		return (
			<TableRow key={0}>
				<TableCell colSpan={6}>
					<Alert severity="info" variant="outlined">
						{" "}
						No transactions
					</Alert>
				</TableCell>
			</TableRow>
		);
	}

	function getLoadingRows() {
		const rows = [];
		for (let i = 0; i < searchParameters.pageSize; i++) {
			rows.push(
				<TableRow key={i}>
					<TableCell className={styles.normalColumn}>
						<i>Loading...</i>
					</TableCell>
					<TableCell className={styles.normalColumn}>
						<LinearProgress color="inherit" />
					</TableCell>
					<TableCell className={styles.wideColumn}>
						<LinearProgress color="inherit" />
					</TableCell>
					<TableCell className={styles.normalColumn}>
						<LinearProgress color="inherit" />
					</TableCell>
					<TableCell className={styles.normalColumn}>
						<LinearProgress color="inherit" />
					</TableCell>
					<TableCell className={styles.normalColumn}>
						<LinearProgress color="inherit" />
					</TableCell>
				</TableRow>
			);
		}
		return rows;
	}

	function handleBack() {
		setView(PageView.Accounts);
	}
}
