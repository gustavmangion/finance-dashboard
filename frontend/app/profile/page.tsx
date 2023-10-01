"use client";

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/profile.module.scss";
import LinkedAccounts from "./linkedAccounts/linkedAccounts";
import { useSecurePage } from "../hooks/authHook";
import { useRouter } from "next/navigation";
import { AuthStatus } from "../enums/authStatusEnum";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useEffect } from "react";

export default function ProfilePage() {
	const authStatus = useSecurePage();
	const router = useRouter();

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
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
