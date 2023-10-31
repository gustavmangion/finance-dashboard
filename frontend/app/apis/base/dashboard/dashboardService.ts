import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import getHeaders from "../headers";
import NumberCard from "./types";

export const dashboardApi = createApi({
	reducerPath: "dashboardApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/dashboard`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		getOverviewCards: builder.query<NumberCard[], string>({
			query: (currency: string) => `/overviewCards/${currency}`,
		}),
	}),
});

export const { useGetOverviewCardsQuery } = dashboardApi;