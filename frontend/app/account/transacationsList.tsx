import Account from "../apis/base/account/types";
import { PageView } from "./page";

type Props = {
	account: Account;
	setView: (val: PageView) => void;
};

export default function TransactionsList({ account, setView }: Props) {
	return <div>Transactions</div>;
}
