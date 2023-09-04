export class NewAccountModel {
	portfolioId: string = "";
	name: string = "";
}

export class AccountsCreationModel {
	accounts: NewAccountModel[] = [];
	uploadId: string = "";
}
