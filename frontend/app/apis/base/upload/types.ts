export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatement {
	account: string = "";
}
