export default interface Statement {
	from: Date;
	to: Date;
	account: string;
}

export class UploadStatement {
	file: File = new File([], "");
}
