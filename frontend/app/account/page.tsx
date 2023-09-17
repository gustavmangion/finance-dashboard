"use client";

import { useRouter } from "next/navigation";
import { useSecurePage } from "../hooks/authHook";
import { useEffect, useState } from "react";
import { AuthStatus } from "../enums/authStatusEnum";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useGetAccountsQuery } from "../apis/base/account/accountService";
import AccountsList from "./accountsList";
import styles from "../styles/account.module.scss";
import EditAccount from "./editAccount";
import Account from "../apis/base/account/types";

export default function AccountPage() {
	const authStatus = useSecurePage();
	const router = useRouter();

	const [view, setView] = useState(PageView.Accounts);
	const [accountToEdit, setAccountToEdit] = useState<Account | undefined>();

	const { data, isLoading, isFetching } = useGetAccountsQuery(null);

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				<div className={styles.accountList}>
					{isLoading || isFetching ? <LoadingSkeleton /> : getView()}
				</div>
			</div>
		);

	function getView() {
		switch (view) {
			case PageView.Accounts:
				return (
					<AccountsList
						accounts={data!}
						setAccountToEdit={setAccountToEdit}
						setPageView={setView}
					/>
				);
			case PageView.Edit:
				return <EditAccount account={accountToEdit} setView={setView} />;
		}
	}
}

export enum PageView {
	Accounts,
	Edit,
	Transactions,
}
