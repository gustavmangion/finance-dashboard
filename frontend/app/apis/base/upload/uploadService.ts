import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getHeaders from "../headers";
import { SetNewStatementPassword } from "./types";

export const uploadApi = createApi({
	reducerPath: "uploadApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/upload`,
		prepareHeaders: (headers) => {
			return getHeaders(headers);
		},
	}),
	endpoints: (builder) => ({
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
	}),
});

export const { useUploadStatementMutation, useSetNewPasswordMutation } =
	uploadApi;
