import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import Portfolio, {
	CreatePortfolioModel,
	CreatePortfolioShareModel,
	EditPortfolioModel,
	PortfolioShare,
	PortfolioShareWith,
} from "./types";
import { setPortfolios } from "@/app/stores/userSlice";

export const portfolioApi = createApi({
	reducerPath: "portfolioApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/portfolio`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	tagTypes: ["Portfolios", "SharedWith", "ShareableWith"],
	endpoints: (builder) => ({
		getPortfolios: builder.query<Portfolio[], null>({
			query: () => "/",
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				const { data } = await queryFulfilled;
				dispatch(setPortfolios(data));
			},
			providesTags: ["Portfolios"],
		}),
		getPortfolioShares: builder.query<PortfolioShare[], string>({
			query: (id: string) => `/Share/${id}`,
			providesTags: ["SharedWith"],
		}),
		getPortfolioSharableWith: builder.query<PortfolioShareWith[], string>({
			query: (id: string) => `/ShareableWith/${id}`,
			providesTags: ["ShareableWith"],
		}),
		addPortfolio: builder.mutation({
			query: (payload: CreatePortfolioModel) => ({
				url: "/",
				method: "POST",
				body: { ...payload },
			}),
			invalidatesTags: ["Portfolios"],
		}),
		addPortfolioShare: builder.mutation({
			query: (payload: CreatePortfolioShareModel) => ({
				url: "/Share",
				method: "POST",
				body: { ...payload },
			}),
			invalidatesTags: ["SharedWith"],
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
	useGetPortfolioSharesQuery,
	useGetPortfolioSharableWithQuery,
	useAddPortfolioMutation,
	useAddPortfolioShareMutation,
	useEditPortfolioMutation,
	useDeletePortfolioMutation,
} = portfolioApi;
