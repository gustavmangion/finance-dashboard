export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	uploadId: string = "";
	needPassword: Boolean = false;
	passwordIncorrect: Boolean = false;
	accountsToSetup: string[] = [];
}

export class SetNewStatementPassword {
	uploadId: string = "";
	password: string = "";
}
