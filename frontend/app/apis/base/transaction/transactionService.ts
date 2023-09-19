import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import getHeaders from "../headers";
import Transaction, { TransactionParameters } from "./types";
import { ListResponse } from "../types";

export const transactionApi = createApi({
	reducerPath: "transactionApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/transaction`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		getTransactions: builder.query<
			ListResponse<Transaction>,
			TransactionParameters
		>({
			query: ({ accountId, currentPage = 0, pageSize = 20 }) =>
				`/transactions?AccountId=${accountId}&PageNumber=${currentPage}&PageSize=${pageSize}`,
		}),
	}),
});

export const { useGetTransactionsQuery } = transactionApi;
