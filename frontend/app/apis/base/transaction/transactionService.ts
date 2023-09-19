import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import getHeaders from "../headers";
import Transaction from "./types";
// import { ListResponse } from "../types";

interface ListResponse<T> {
	page: number;
	per_page: number;
	total: number;
	total_pages: number;
	data: T[];
}

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
			number | string | void
		>({
			query: (accountId, currentPage = 1, pageSize = 20) =>
				`/transactions?AccountId=${accountId}&PageNumber=${currentPage}&PageSize=${pageSize}`,
		}),
	}),
});

export const { useGetTransactionsQuery } = transactionApi;
