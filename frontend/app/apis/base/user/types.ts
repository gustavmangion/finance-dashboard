export default interface User {
	id: string;
	joinDate: Date;
	setupNeeded: boolean;
}

export type GetUser = { id: string };

export class CreateUserModel {
	portfolioName: string = "";
}
