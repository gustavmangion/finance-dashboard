import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import User, { GetUser } from "./types";

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/user`,
	}),
	endpoints: (builder) => ({
		getUser: builder.query<User, GetUser>({
			query: (user: GetUser) => `/user/${user.id}`,
		}),
	}),
});

export const { useGetUserQuery } = userApi;
