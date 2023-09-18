import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Account from "../apis/base/account/types";
import styles from "../styles/account.module.scss";
import materialStyles from "../styles/material.module.scss";
import { getMoneyFormat } from "../helpers/moneyHelper";
import { PageView } from "./page";
import React, { useState } from "react";
import { useAppSelector } from "../hooks/reduxHook";

type Props = {
	accounts: Account[];
	setAccountToEdit: (val: Account | undefined) => void;
	setPageView: (val: PageView) => void;
};

export default function AccountsList({
	accounts,
	setAccountToEdit,
	setPageView,
}: Props) {
	const [selectedPortfolio, setSelectedPortfolio] = useState("All");
	const [filteredAccounts, setFilteredAccounts] = useState(accounts);
	const portfolios = useAppSelector((state) => state.userReducer.portfolios);

	return (
		<>
			<h2>Your Accounts</h2>
			<h3>Portfolio</h3>
			<div className={styles.portfolioPicker}>
				<Select
					name="portfolio"
					label="Portfolio"
					variant="standard"
					onChange={handlePortfolioChange}
					value={selectedPortfolio}
					required
					placeholder="Portfolio"
				>
					{mapPortfolioOptions()}
				</Select>
				<Button
					className={styles.managePortfoliosButton}
					onClick={() => setPageView(PageView.Portfolios)}
				>
					Manage Portfolios
				</Button>
			</div>
			{filteredAccounts.map((account) => {
				return (
					<Accordion key={account.id}>
						<AccordionSummary
							className={styles.accountListHeader}
							expandIcon={<ExpandMoreIcon />}
						>
							<h4 className={account.balance < 0 ? styles.negativeBalance : ""}>
								{`${account.name} - 
								${getMoneyFormat(account.balance, account.currency)}`}
							</h4>
						</AccordionSummary>
						<AccordionDetails className={styles.accountListDetails}>
							<div>
								<p>Account Number: {account.accountNumber}</p>
								<p>Bank: {account.bankName}</p>
								<p>IBAN: {account.iban}</p>
								<p>Currency: {account.currency}</p>
								<p>Total Debit: {getMoneyFormat(account.totalOut)}</p>
								<p>Total Credit: {getMoneyFormat(account.totalIn)}</p>
							</div>
							<div className={styles.buttons}>
								<Button className={materialStyles.smallButton}>
									View Transactions
								</Button>
								<Button
									className={[
										materialStyles.smallButton,
										materialStyles.secondaryButton,
									].join(" ")}
									onClick={(e) => handleEditClick(e, account)}
								>
									Edit
								</Button>
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</>
	);

	function handleEditClick(
		e: React.MouseEvent<HTMLButtonElement>,
		account: Account
	) {
		setAccountToEdit(account);
		setPageView(PageView.Edit);
	}

	function handlePortfolioChange(e: SelectChangeEvent) {
		setSelectedPortfolio(e.target.value);

		if (e.target.value === "All") setFilteredAccounts(accounts);
		else
			setFilteredAccounts(
				accounts.filter((account) => {
					return account.portfolioId === e.target.value;
				})
			);
	}

	function mapPortfolioOptions() {
		const options: React.ReactElement[] = [];
		options.push(
			<MenuItem key="All" value="All">
				All
			</MenuItem>
		);
		portfolios.map((x) => {
			options.push(
				<MenuItem key={x.id} value={x.id}>
					{x.name}
				</MenuItem>
			);
		});

		return options;
	}
}
