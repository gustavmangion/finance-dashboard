import { getSession } from "next-auth/react";

export default async function getHeaders(headers: any) {
	const session = await getSession();
	const userToken = session?.user?.userToken;
	headers.set("Authorization", `Bearer ${userToken}`);
	return headers;
}
