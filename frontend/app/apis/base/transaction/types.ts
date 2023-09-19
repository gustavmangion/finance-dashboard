export default interface Transaction {
	id: string;
	tranDate: Date;
	description: string;
	CardNo: string;
	Reference: string;
	amount: number;
	category: string;
}
