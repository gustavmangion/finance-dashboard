import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import User, { GetUser } from "./types";
import { getSession } from "next-auth/react";

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/user`,
	}),
	endpoints: (builder) => ({
		getUser: builder.query<User, null>({
			query: () => `/user/${getLoggedInUserId}`,
		}),
	}),
});

export const { useGetUserQuery } = userApi;

async function getLoggedInUserId() {
	const session = await getSession();
	return session?.user?.id;
}
