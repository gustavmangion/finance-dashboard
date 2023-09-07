import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import User, { CreateUserModel, GetUserModel } from "./types";
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
	endpoints: (builder) => ({
		getUser: builder.query<GetUserModel, null>({
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
	}),
});

export const { useGetUserQuery, useAddUserMutation } = userApi;
