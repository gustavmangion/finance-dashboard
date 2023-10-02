"use client";

import { useRouter } from "next/navigation";
import { useSecurePage } from "../hooks/authHook";
import { useEffect, useState } from "react";
import { AuthStatus } from "../enums/authStatusEnum";
import LoadingSkeleton from "../components/loadingSkeleton";
import { useGetAccountsQuery } from "../apis/base/account/accountService";
import AccountsList from "./accountsList";
import EditAccount from "./editAccount";
import Account from "../apis/base/account/types";
import PortfolioEdit from "./portfolioEdit";
import TransactionsList from "./transactionsList";

export default function AccountPage() {
	const authStatus = useSecurePage();
	const router = useRouter();

	const [view, setView] = useState(PageView.Accounts);
	const [accountForView, setAccountForView] = useState<Account | undefined>();

	const { data, isLoading, isFetching } = useGetAccountsQuery(null);

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				{isLoading || isFetching ? <LoadingSkeleton /> : getView()}
			</div>
		);

	function getView() {
		switch (view) {
			case PageView.Accounts:
				return (
					<>
						<AccountsList
							accounts={data!}
							setAccountForView={setAccountForView}
							setPageView={setView}
						/>
					</>
				);
			case PageView.Edit:
				return <EditAccount account={accountForView!} setView={setView} />;
			case PageView.Portfolios:
				return <PortfolioEdit setView={setView} />;
			case PageView.Transactions:
				return <TransactionsList account={accountForView!} setView={setView} />;
		}
	}
}

export enum PageView {
	Accounts,
	Edit,
	Transactions,
	Portfolios,
}
