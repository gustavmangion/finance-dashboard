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
