export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	uploadId: string = "";
	needPassword: Boolean = false;
	accountsToSetup: string[] = [];
}

export class SetNewStatementPassword {
	uploadId: string = "";
	password: string = "";
}

export class ResubmitUpload {
	uploadId: string = "";
}
