export default interface TestMessage {
	text: string;
}

export type GetTestMessage = { id: number };

export type CreateTestMessage = {
	text: string;
};
