import Account from "../apis/base/account/types";
import { useGetTransactionsQuery } from "../apis/base/transaction/transactionService";
import { PageView } from "./page";

type Props = {
	account: Account;
	setView: (val: PageView) => void;
};

export default function TransactionsList({ account, setView }: Props) {
	const { isLoading, isFetching, data } = useGetTransactionsQuery(account.id);

	console.log(data);
	return <div>Transactions</div>;
}
