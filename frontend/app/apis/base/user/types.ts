import Portfolio from "../portfolio/types";

export default interface User {
	id: string;
	setupNeeded: boolean;
}

export interface UserShareModel {
	shareCodeSetup: boolean;
	userShares: UserShare[];
}

export interface UserShare {
	id: string;
	alias: string;
	inviteCode: number;
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
