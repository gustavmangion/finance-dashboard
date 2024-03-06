"use client";

import NextAuth, { Account, AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: { access_type: "offline" },
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user, account }) {
			if (account) token.userToken = account.id_token as string;

			if (account && user) {
				token.accessToken = account.access_token as string;
				token.accessTokenExpires = account.expires_at as number;
				token.refreshToken = account.refresh_token as string;
			}

			if (Date.now() < token.accessTokenExpires) return token;

			return refreshAccessToken(token);
		},
		async session({ session, token, user }) {
			if (Date.now() < token.accessTokenExpires)
				await refreshAccessToken(token);

			session.user = token;

			return session;
		},
	},
};

const authHandler = NextAuth(authOptions);
export default async function handler(...params: any[]) {
	await authHandler(...params);
}

async function refreshAccessToken(token: JWT) {
	try {
		const url =
			"https://oauth2.googleapis.com/token?" +
			new URLSearchParams({
				client_id: process.env.GOOGLE_CLIENT_ID as string,
				client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
			});

		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});

		const refreshedTokens = await response.json();

		if (!response.ok) throw refreshedTokens;

		token.accessToken = refreshedTokens.access_token;
		token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000;
		token.refreshToken = refreshedTokens.refresh_token ?? token.refreshToken; // Fall back to old refresh token
		token.userToken = refreshedTokens.id_token;

		return token;
	} catch (error) {
		console.log(error);

		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}
