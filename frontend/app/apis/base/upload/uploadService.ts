import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { UploadStatement } from "./types";
import getHeaders from "../headers";

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
	}),
});

export const { useUploadStatementMutation } = uploadApi;
