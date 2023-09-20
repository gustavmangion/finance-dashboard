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

type Props = {
	account: Account;
	setView: (val: PageView) => void;
};

export default function TransactionsList({ account, setView }: Props) {
	const [pageSize, setPageSize] = useState(30);
	const [currentPage, setCurrentPage] = useState(0);

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
	console.log(searchMeta);
	return (
		<>
			<h2>Transactions for {account.name}</h2>
			<Paper className={styles.transactionsTable}>
				<TableContainer className={styles.tableContainer}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Amount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{searchMeta?.data.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>{transaction.tranDate.toString()}</TableCell>
									<TableCell>{transaction.description}</TableCell>
									<TableCell>{transaction.amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 20, 50]}
					// rowsPerPageOptions={[]}
					component="div"
					count={searchMeta!.totalCount}
					page={searchMeta!.currentPage}
					rowsPerPage={searchMeta!.pageSize}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
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
}
