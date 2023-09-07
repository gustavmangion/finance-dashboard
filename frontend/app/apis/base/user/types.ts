import Portfolio from "../portfolio/types";

export default interface User {
	id: string;
	setupNeeded: boolean;
}

export type GetUser = { id: string };

export class CreateUserModel {
	portfolioName: string = "";
}

export class GetUserModel {
	user!: User;
	portfolios: Portfolio[] = [];
}
