import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import {
	Bank,
	ResubmitUpload,
	SetNewStatementPassword,
	SetBank,
} from "./types";

export const uploadApi = createApi({
	reducerPath: "uploadApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/upload`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
		getBanks: builder.query<Bank[], null>({
			query: () => "/banks",
		}),
		uploadStatement: builder.mutation({
			query: (payload: File) => {
				const body = new FormData();
				body.append("Content-Type", "application/pdf");
				body.append("file", payload);
				return {
					url: "uploadStatement",
					method: "POST",
					body,
					formData: true,
				};
			},
		}),
		setNewPassword: builder.mutation({
			query: (payload: SetNewStatementPassword) => ({
				url: "/statementPassword",
				method: "POST",
				body: { ...payload },
			}),
		}),
		setBank: builder.mutation({
			query: (payload: SetBank) => ({
				url: "/statementBank",
				method: "POST",
				body: { ...payload },
			}),
		}),
		resubmitUpload: builder.mutation({
			query: (payload: ResubmitUpload) => ({
				url: "/resubmitUpload",
				method: "POST",
				body: { ...payload },
			}),
		}),
	}),
});

export const {
	useGetBanksQuery,
	useUploadStatementMutation,
	useSetNewPasswordMutation,
	useSetBankMutation,
	useResubmitUploadMutation,
} = uploadApi;
