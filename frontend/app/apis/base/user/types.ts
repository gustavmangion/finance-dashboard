export default interface User {
	id: string;
	// joinDate: Date;
	setupNeeded: boolean;
	householdName: string;
}

export type GetUser = { id: string };

export class CreateUser {
	householdName: string = "";
}

export class CreateUserForm {
	householdName: string = "";
}
