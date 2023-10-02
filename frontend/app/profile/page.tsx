"use client";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	IconButton,
	Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/profile.module.scss";
import LinkedAccounts from "./linkedAccounts/linkedAccounts";
import { useSecurePage } from "../hooks/authHook";
import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info";

export default function ProfilePage() {
	const authStatus = useSecurePage();
	const router = useRouter();
	const linkedAccountsToolTipText =
		"Link accounts with other users to share portfolios";

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				<Accordion className={styles.profileAccordion}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<div>
							Linked Accounts
							<Tooltip title={linkedAccountsToolTipText}>
								<IconButton>
									<InfoIcon />
								</IconButton>
							</Tooltip>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<LinkedAccounts />
					</AccordionDetails>
				</Accordion>
			</div>
		);
}
