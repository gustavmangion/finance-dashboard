import {
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

	if (isLoading || isFetching) return <LoadingSkeleton />;

	return (
		<>
			<h2>Transactions for {account.name}</h2>
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
								<TableCell>Date</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Card</TableCell>
								<TableCell>Reference</TableCell>
								<TableCell>Amount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{searchMeta?.data.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>{getDate(transaction.tranDate)}</TableCell>
									<TableCell>
										{getCategoryFromId(transaction.category)}
									</TableCell>
									<TableCell>{transaction.description}</TableCell>
									<TableCell>{transaction.cardNo}</TableCell>
									<TableCell>{transaction.reference}</TableCell>
									<TableCell>{getMoneyFormat(transaction.amount)}</TableCell>
								</TableRow>
							))}
						</TableBody>
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
}
