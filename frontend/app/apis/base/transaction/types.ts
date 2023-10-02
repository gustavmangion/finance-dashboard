import dayjs, { Dayjs } from "dayjs";

export default interface Transaction {
	id: string;
	tranDate: string;
	description: string;
	cardNo: string;
	reference: string;
	amount: number;
	category: number;
}

export class TransactionParameters {
	accountId: string;
	from: string | null = null;
	to: string | null = null;
	category: string[] = [];
	currentPage: number;
	pageSize: number;

	constructor(accountId: string, pageSize: number = 20) {
		this.accountId = accountId;
		this.currentPage = 0;
		this.pageSize = pageSize;
	}
}
