import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Account from "../apis/base/account/types";
import styles from "../styles/account.module.scss";
import materialStyles from "../styles/material.module.scss";
import { getMoneyFormat } from "../helpers/moneyHelper";

type Props = {
	accounts: Account[];
};

export default function AccountsList({ accounts }: Props) {
	return (
		<>
			{accounts.map((account) => {
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
										materialStyles.secondary,
									].join(" ")}
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
}
