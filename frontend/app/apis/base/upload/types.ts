export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	fileId: string = "";
	newAccount: Boolean = false;
}
