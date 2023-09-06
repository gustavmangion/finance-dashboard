import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import Portfolio from "./types";
import { setPortfolios } from "@/app/stores/userSlice";

export const portfolioApi = createApi({
	reducerPath: "portfolioApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/portfolio`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		getPortfolios: builder.query<Portfolio[], null>({
			query: () => "/",
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				const { data } = await queryFulfilled;
				dispatch(setPortfolios(data));
			},
		}),
	}),
});

export const { useGetPortfoliosQuery } = portfolioApi;
