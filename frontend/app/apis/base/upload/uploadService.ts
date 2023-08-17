import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Statement, { UploadStatement } from "./types";

export const uploadApi = createApi({
	reducerPath: "uploadApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/upload`,
		prepareHeaders: (headers) => {
			// headers.set("Content-Type", "application/json");
		},
	}),
	endpoints: (builder) => ({
		uploadStatement: builder.mutation({
			query: (payload: UploadStatement) => ({
				url: "uploadStatement",
				method: "POST",
				body: { ...payload },
			}),
		}),
	}),
});

export const { useUploadStatementMutation } = uploadApi;
