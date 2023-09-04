import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import { AccountsCreationModel } from "./types";

export const accountApi = createApi({
	reducerPath: "accountApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/account`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		createAccounts: builder.mutation({
			query: (payload: AccountsCreationModel) => ({
				url: "/",
				method: "POST",
				body: { ...payload },
			}),
		}),
	}),
});

export const { useCreateAccountsMutation } = accountApi;
