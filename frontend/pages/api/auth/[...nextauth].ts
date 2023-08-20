"use client";

import NextAuth, { Account, AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { store } from "@/app/stores/store";

const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user, account }) {
			if (account) {
				token.accessToken = account.access_token as string;
			}

			if (account && account.expires_at && Date.now() > account.expires_at)
				return refreshAccessToken(token, account);

			return { ...token, ...user };
		},
		async session({ session, token, user }) {
			session.user = token;
			return session;
		},
	},
};

const authHandler = NextAuth(authOptions);
export default async function handler(...params: any[]) {
	await authHandler(...params);
}

async function refreshAccessToken(token: JWT, account: Account) {
	console.log("refreshing");
	try {
		const url =
			"https://oauth2.googleapis.com/token?" +
			new URLSearchParams({
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				grantType: "refresh_token",
				refreshToken: account.refresh_token as string,
			});

		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});

		const refreshedTokens = await response.json();

		if (!response.ok) throw refreshAccessToken;

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: refreshedTokens.expires_at,
			refreshToken: refreshedTokens.refresh_token ?? account.refresh_token, //fallback to all refresh token
		};
	} catch (error) {
		console.log(error);
	}

	return {
		...token,
		error: "RefreshAccessTokenError",
	};
}
