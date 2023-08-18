import NextAuth, { Account } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			//Initial sign in
			if (account && user) {
				return {
					accessToken: account.access_token,
					accessTokenExpires: account.expires_at,
					refreshToken: account.refresh_token,
					user,
				};
			}

			if (account && account.expires_at && Date.now() < account.expires_at)
				return token;

			if (account) return refreshAccessToken(token, account);

			return token;
		},
		async signIn({ user, account }) {
			user.email = account!.id_token;
			return true;
		},
	},
});

async function refreshAccessToken(token: JWT, account: Account) {
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
