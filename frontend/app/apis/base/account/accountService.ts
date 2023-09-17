import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import Account, { AccountCreationModel, EditAccountModel } from "./types";

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
		getAccounts: builder.query<Account[], null>({
			query: () => "/",
		}),
		editAccount: builder.mutation({
			query: (payload: EditAccountModel) => ({
				url: `/${payload.id}`,
				method: "PUT",
				body: { ...payload.body },
			}),
		}),
	}),
});

export const {
	useCreateAccountMutation,
	useGetAccountsQuery,
	useEditAccountMutation,
} = accountApi;
