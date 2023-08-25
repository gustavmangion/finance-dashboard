export default interface User {
	id: string;
	joinDate: Date;
}

export type GetUser = { id: string };

export type CreateUser = {
	id: string;
};
