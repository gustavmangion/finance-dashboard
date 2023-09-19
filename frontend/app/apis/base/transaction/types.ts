export default interface Transaction {
	id: string;
	tranDate: Date;
	description: string;
	cardNo: string;
	reference: string;
	amount: number;
	category: string;
}

export interface TransactionParameters {
	accountId: string;
	currentPage: number;
	pageSize: number;
}
