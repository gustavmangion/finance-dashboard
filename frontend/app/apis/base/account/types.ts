export class NewAccountModel {
	portfolioId: string = "";
	name: string = "";
	accountNumber: string = "";
}

export class AccountsCreationModel {
	accounts: NewAccountModel[] = [];
	uploadId: string = "";
}
