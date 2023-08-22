import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Statement, { UploadStatement } from "./types";
import { getSession, useSession } from "next-auth/react";

const getHeaders = async (headers: any) => {
	const session = await getSession();
	const userToken = session?.user?.userToken;
	headers.set("Authorization", `Bearer ${userToken}`);
	return headers;
};

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
			query: (payload: UploadStatement) => ({
				url: "uploadStatement",
				method: "POST",
				body: { ...payload },
			}),
		}),
	}),
});

export const { useUploadStatementMutation } = uploadApi;
