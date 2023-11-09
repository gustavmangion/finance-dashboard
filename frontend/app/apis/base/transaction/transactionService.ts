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
	tagTypes: ["transactions"],
	endpoints: (builder) => ({
		getTransactions: builder.query<
			ListResponse<Transaction>,
			TransactionParameters
		>({
			query: (parameters: TransactionParameters) => {
				let queryParameters: string = "";
				if (parameters.from && parameters.to) {
					queryParameters = queryParameters.concat(
						`&From=${parameters.from}&To=${parameters.to}`
					);
				}
				if (parameters.category.length > 0)
					queryParameters = queryParameters.concat(
						`&Category=${parameters.category.join(",")}`
					);
				return {
					url:
						`/transactions?AccountId=${parameters.accountId}` +
						queryParameters +
						`&PageNumber=${parameters.currentPage}&PageSize=${parameters.pageSize}`,
				};
			},
			providesTags: ["transactions"],
		}),
	}),
});

export const { useGetTransactionsQuery } = transactionApi;
