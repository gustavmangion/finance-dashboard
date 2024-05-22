export default interface Account {
	id: string;
	portfolioId: string;
	accountNumber: string;
	name: string;
	bankName: string;
	iban: string;
	currency: string;
	balance: number;
	totalOut: number;
	totalIn: number;
}

export class AccountCreationModel {
	portfolioId: string = "";
	name: string = "";
	accountNumber: string = "";
	bankName: string = "";
}

export class EditAccountModel {
	id: string = "";
	body: EditAccountModelBody = new EditAccountModelBody();
}

class EditAccountModelBody {
	name: string = "";
	portfolioId: string = "";
}
