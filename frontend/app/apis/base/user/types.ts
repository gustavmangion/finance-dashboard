export default interface User {
	id: string;
	userStatus: number;
	baseCurrency: string;
}

export interface UserShareModel {
	shareCodeSetup: boolean;
	userShares: UserShare[];
}

export interface UserShare {
	id: string;
	alias: string;
	inviteCode: string;
	revoked: boolean | null;
}

export interface UserShareCode {
	code: string;
}

export type GetUser = { id: string };

export class CreateUserModel {
	portfolioName: string = "";
}

export class CreateUserShareCode {
	code: string = "";
}

export class CreateUserShare {
	alias: string = "";
}

export class AcceptUserShare {
	inviteCode: string = "";
	shareCode: string = "";
	alias: string = "";
}
