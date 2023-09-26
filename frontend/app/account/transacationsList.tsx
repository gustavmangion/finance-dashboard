import {
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
import { PageView } from "./page";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useState } from "react";
import styles from "../styles/account.module.scss";
import React from "react";
import { getMoneyFormat } from "../helpers/moneyHelper";
import { getCategoryFromId } from "../helpers/transactionHelper";
import TransactionsListFilter from "./transactionsListFilter";

type Props = {
	account: Account;
	setView: (val: PageView) => void;
};

export default function TransactionsList({ account, setView }: Props) {
	const [pageSize, setPageSize] = useState(20);
	const [currentPage, setCurrentPage] = useState(0);
	let rowsPerPageOptions: number[] = [];

	if (window.innerWidth > 500) rowsPerPageOptions = [5, 10, 20, 50];

	const {
		isLoading,
		isFetching,
		data: searchMeta,
	} = useGetTransactionsQuery({
		accountId: account.id,
		currentPage: currentPage,
		pageSize: pageSize,
	});

	if (isLoading) return <LoadingSkeleton />;

	return (
		<>
			<h2>Transactions for {account.name}</h2>
			<TransactionsListFilter />
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
						{isFetching ? (
							getLoadingRows()
						) : (
							<TableBody>
								{searchMeta?.data.map((transaction) => (
									<TableRow key={transaction.id}>
										<TableCell className={styles.normalColumn}>
											{getDate(transaction.tranDate)}
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
								))}
							</TableBody>
						)}
					</Table>
				</TableContainer>
			</Paper>
		</>
	);

	function handlePageChange(event: unknown, newPage: number) {
		setCurrentPage(newPage);
	}

	function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
		setPageSize(parseInt(event.target.value, 10));
		setCurrentPage(0);
	}

	function getDate(transactionDate: number) {
		let date = new Date(0);
		date.setUTCSeconds(transactionDate);
		return date.toLocaleDateString();
	}

	function getLoadingRows() {
		const rows = [];
		for (let i = 0; i < pageSize; i++) {
			rows.push(
				<TableRow>
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
}
