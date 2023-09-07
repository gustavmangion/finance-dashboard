import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Account from "../apis/base/account/types";
import styles from "../styles/account.module.scss";
import { getCurrencySymbol, getMoneyFormat } from "../helpers/moneyHelper";

type Props = {
	accounts: Account[];
};

export default function AccountsList({ accounts }: Props) {
	console.log(accounts);
	return (
		<>
			{accounts.map((account) => {
				return (
					<Accordion key={account.id}>
						<AccordionSummary
							className={styles.accountListHeader}
							expandIcon={<ExpandMoreIcon />}
						>
							<h4>
								{`${account.name} - 
								${getMoneyFormat(account.balance, account.currency)}`}
							</h4>
						</AccordionSummary>
						<AccordionDetails className={styles.accountListDetails}>
							<div>
								<p>Account Number: {account.accountNumber}</p>
								<p>IBAN: {account.iban}</p>
								<p>Currency: {account.currency}</p>
								<p>Total Debit: {getMoneyFormat(account.totalOut)}</p>
								<p>Total Credit: {getMoneyFormat(account.totalIn)}</p>
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</>
	);
}
