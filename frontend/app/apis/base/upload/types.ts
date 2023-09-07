export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	uploadId: string = "";
	needPassword: Boolean = false;
	accountsToSetup: string[] = [];
	statementAlreadyUploaded: Boolean = false;
}

export class SetNewStatementPassword {
	uploadId: string = "";
	password: string = "";
}

export class ResubmitUpload {
	uploadId: string = "";
}
