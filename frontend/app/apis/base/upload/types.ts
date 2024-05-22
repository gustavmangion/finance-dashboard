export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	uploadId: string = "";
	needPassword: Boolean = false;
	needBankName: Boolean = false;
	accountsToSetup: string[] = [];
	statementAlreadyUploaded: Boolean = false;
	bankName: string = "";
}

export class SetNewStatementPassword {
	uploadId: string = "";
	password: string = "";
}

export class ResubmitUpload {
	uploadId: string = "";
}

export class Bank {
	id: string = "";
	name: string = "";
}

export class SetBank {
	uploadId: string = "";
	bankId: string = "";
}
