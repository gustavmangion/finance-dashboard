import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/profile.module.scss";
import LinkedAccounts from "./linkedAccounts";

export default function ProfilePage() {
	return (
		<div className="container">
			<Accordion className={styles.profileAccordion}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					Linked Accounts
				</AccordionSummary>
				<AccordionDetails>
					<LinkedAccounts />
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
