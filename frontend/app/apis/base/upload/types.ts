export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatementResponse {
	uploadId: string = "";
	isNewAccount: Boolean = false;
}
