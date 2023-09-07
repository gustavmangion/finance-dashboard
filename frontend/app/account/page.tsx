"use client";

import { useRouter } from "next/navigation";
import { useSecurePage } from "../hooks/authHook";
import { useEffect } from "react";
import { AuthStatus } from "../enums/authStatusEnum";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useGetAccountsQuery } from "../apis/base/account/accountService";
import AccountsList from "./accountsList";
import styles from "../styles/account.module.scss";

export default function AccountPage() {
	const authStatus = useSecurePage();
	const router = useRouter();

	const { data, isLoading } = useGetAccountsQuery(null);

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				<h2>Your Accounts</h2>
				<div className={styles.accountList}>
					{isLoading ? <LoadingSkeleton /> : <AccountsList accounts={data!} />}
				</div>
			</div>
		);
}
