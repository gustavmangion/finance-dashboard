import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import getHeaders from "../headers";
import NumberCard, { FilterModel } from "./types";

export const dashboardApi = createApi({
	reducerPath: "dashboardApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/dashboard`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		getOverviewCards: builder.query<NumberCard[], FilterModel>({
			query: (filter: FilterModel) => ({
				url: "/overviewCards",
				method: "GET",
				params: { ...filter },
			}),
		}),
	}),
});

export const { useGetOverviewCardsQuery } = dashboardApi;
