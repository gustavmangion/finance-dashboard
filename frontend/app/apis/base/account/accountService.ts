import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import { AccountCreationModel } from "./types";

export const accountApi = createApi({
	reducerPath: "accountApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/account`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		createAccount: builder.mutation({
			query: (payload: AccountCreationModel) => ({
				url: "/",
				method: "POST",
				body: { ...payload },
			}),
		}),
	}),
});

export const { useCreateAccountMutation } = accountApi;
