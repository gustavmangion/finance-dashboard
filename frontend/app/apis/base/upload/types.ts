export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	uploadId: string = "";
	needPassword: Boolean = false;
}

export class SetNewStatementPassword {
	uploadId: string = "";
	password: string = "";
}

export class SetNewStatementPasswordResponse {
	passwordCorrect: Boolean = false;
	accountsToSetup: string[] = [];
}
