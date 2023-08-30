export default interface User {
	id: string;
	joinDate: Date;
	setupNeeded: boolean;
	householdName: string;
}

export type GetUser = { id: string };

export class CreateUserModel {
	bucketName: string = "";
}

export class CreateUserForm {
	bucketName: string = "";
}
