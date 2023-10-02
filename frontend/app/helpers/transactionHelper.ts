export function getCategoryFromId(categoryId: number): string {
	switch (categoryId) {
		case 0:
			return "Purchase";
		case 1:
			return "Cheque Deposit";
		case 2:
			return "Cheque Withdrawal";
		case 3:
			return "Bank Transfer";
		case 4:
			return "Atm Withdrawal";
		case 5:
			return "Salary";
		case 6:
			return "Refund";
		case -1:
			return "Balance Brought Forward";
		default:
			return "Other";
	}
}

export function getCategories(): CategoryListItem[] {
	const keys = Object.keys(Category).filter((v) => !isNaN(Number(v)));
	const categories: CategoryListItem[] = [];

	keys.forEach((key, index) => {
		const categoryID = Number.parseInt(key);
		categories.push(
			new CategoryListItem(categoryID, getCategoryFromId(categoryID))
		);
	});

	return categories.sort((a, b) => (a.name > b.name ? 1 : -1));
}

export enum Category {
	Purchase = 0,
	ChequeDeposit = 1,
	ChequeWithdrawal = 2,
	BankTransfer = 3,
	AtmWithdrawal = 4,
	Salary = 5,
	Refund = 6,
	BalanceBroughtForward = -1,
	Other = 99,
}

export class CategoryListItem {
	id: number = -99;
	name: string = "";

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}
