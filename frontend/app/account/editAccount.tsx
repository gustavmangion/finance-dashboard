import Account from "../apis/base/account/types";

type Props = {
	account: Account | undefined;
	setAccountToEdit: (val: Account | undefined) => void;
};

export default function EditAccount({ account, setAccountToEdit }: Props) {
	return <p>Edit Account</p>;
}
