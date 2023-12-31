import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import User, {
	AcceptUserShare,
	CreateUserModel,
	CreateUserShare,
	CreateUserShareCode,
	UserShareCode,
	UserShareModel,
} from "./types";
import getHeaders from "../headers";
import { displayError } from "@/app/stores/notificationSlice";
import { setUser } from "@/app/stores/userSlice";

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/user`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	tagTypes: ["UserShare", "UserShareCode"],
	endpoints: (builder) => ({
		getUser: builder.query<User, null>({
			query: () => `/`,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch (error) {
					dispatch(
						displayError(
							"Unable to load your profile, please contact us to resolve this issue"
						)
					);
				}
			},
		}),
		addUser: builder.mutation({
			query: (payload: CreateUserModel) => ({
				url: "/",
				method: "POST",
				body: { ...payload },
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch (error) {
					dispatch(
						displayError(
							"Unable to load your profile, please contact us to resolve this issue"
						)
					);
				}
			},
		}),
		getUserShares: builder.query<UserShareModel, null>({
			query: () => `/Share`,
			providesTags: ["UserShare"],
		}),
		addUserShare: builder.mutation({
			query: (payload: CreateUserShare) => ({
				url: `/Share`,
				method: "POST",
				body: { ...payload },
			}),
		}),
		getUserShareCode: builder.query<UserShareCode, null>({
			query: () => `/ShareCode`,
			providesTags: ["UserShareCode"],
		}),
		addOrUpdateUserShareCode: builder.mutation({
			query: (payload: CreateUserShareCode) => ({
				url: `/ShareCode`,
				method: "POST",
				body: { ...payload },
			}),
			invalidatesTags: ["UserShareCode"],
		}),
		acceptUserShare: builder.mutation({
			query: (payload: AcceptUserShare) => ({
				url: `/Share`,
				method: "PUT",
				body: { ...payload },
			}),
		}),
		deleteOrRevokeUserShare: builder.mutation({
			query: (payload: string) => ({
				url: `/Share/${payload}`,
				method: "DELETE",
			}),
			invalidatesTags: ["UserShare"],
		}),
	}),
});

export const {
	useGetUserQuery,
	useAddUserMutation,
	useGetUserSharesQuery,
	useAddUserShareMutation,
	useGetUserShareCodeQuery,
	useAddOrUpdateUserShareCodeMutation,
	useAcceptUserShareMutation,
	useDeleteOrRevokeUserShareMutation,
} = userApi;
