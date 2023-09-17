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
import { PageView } from "./page";

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
	return (
		<>
			<h2>Your Accounts</h2>

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
										materialStyles.secondary,
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
}
