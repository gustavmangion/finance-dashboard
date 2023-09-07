export default interface Account {
	id: string;
	portfolioId: string;
	accountNumber: string;
	name: string;
	iban: string;
	currency: string;
}

export class AccountCreationModel {
	portfolioId: string = "";
	name: string = "";
	accountNumber: string = "";
}
