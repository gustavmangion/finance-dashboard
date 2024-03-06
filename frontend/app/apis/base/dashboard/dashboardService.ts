import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import getHeaders from "../headers";
import NumberCard, { FilterModel, NameValueModel } from "./types";
import Transaction from "../transaction/types";

export const dashboardApi = createApi({
	reducerPath: "dashboardApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/dashboard`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	tagTypes: ["dashboard"],
	endpoints: (builder) => ({
		getOverviewCards: builder.query<NumberCard[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/overviewCards",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
		getTotalByCard: builder.query<NameValueModel[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/totalbycard",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
		getHighestSpendByVendor: builder.query<NameValueModel[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/highestspendbyvendor",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
		getExpenseBreakdown: builder.query<NameValueModel[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/expensebreakdown",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
		getExpenseByDate: builder.query<NameValueModel[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/ExpenseByDate",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
		getCardTransactions: builder.query<Transaction[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/CardTransactions",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
		getVendorTransactions: builder.query<Transaction[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/VendorTransactions",
				method: "GET",
				params: { ...filter },
			}),
			providesTags: ["dashboard"],
		}),
	}),
});

export const {
	useGetOverviewCardsQuery,
	useGetTotalByCardQuery,
	useGetHighestSpendByVendorQuery,
	useGetExpenseBreakdownQuery,
	useGetExpenseByDateQuery,
	useLazyGetCardTransactionsQuery,
	useLazyGetVendorTransactionsQuery,
	useLazyGetHighestSpendByVendorQuery,
} = dashboardApi;
