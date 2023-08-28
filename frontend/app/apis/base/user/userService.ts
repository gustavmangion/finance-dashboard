import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import User, { CreateUserModel, GetUser } from "./types";
import { getSession } from "next-auth/react";
import getHeaders from "../headers";

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/user`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		getUser: builder.query<User, null>({
			query: () => `/`,
		}),
		addUser: builder.mutation({
			query: (payload: CreateUserModel) => ({
				url: "/",
				method: "POST",
				body: { ...payload },
			}),
		}),
	}),
});

export const { useGetUserQuery, useAddUserMutation } = userApi;
