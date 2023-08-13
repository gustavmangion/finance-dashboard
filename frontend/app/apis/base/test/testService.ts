import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import TestMessage from "./types";

export const testApi = createApi({
	reducerPath: "testApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.BASE_API_URL}/dashboard`,
	}),
	endpoints: (builder) => ({
		getTestMessage: builder.query<TestMessage, null>({
			query: () => "test",
		}),
	}),
});

export const { useGetTestMessageQuery } = testApi;
