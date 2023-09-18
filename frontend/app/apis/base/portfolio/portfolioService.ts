import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import Portfolio, { EditPortfolioModel } from "./types";
import { setPortfolios } from "@/app/stores/userSlice";

export const portfolioApi = createApi({
	reducerPath: "portfolioApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/portfolio`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	tagTypes: ["Portfolios"],
	endpoints: (builder) => ({
		getPortfolios: builder.query<Portfolio[], null>({
			query: () => "/",
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				const { data } = await queryFulfilled;
				dispatch(setPortfolios(data));
			},
			providesTags: ["Portfolios"],
		}),
		editPortfolio: builder.mutation({
			query: (payload: EditPortfolioModel) => ({
				url: `/${payload.id}`,
				method: "PUT",
				body: { ...payload.body },
			}),
			invalidatesTags: ["Portfolios"],
		}),
		deletePortfolio: builder.mutation({
			query: (payload: string) => ({
				url: `/${payload}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Portfolios"],
		}),
	}),
});

export const {
	useGetPortfoliosQuery,
	useEditPortfolioMutation,
	useDeletePortfolioMutation,
} = portfolioApi;
