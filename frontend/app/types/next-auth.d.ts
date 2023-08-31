import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";

declare module "next-auth" {
	interface User {
		userToken: string;
		picture: string;
	}

	interface Session extends DefaultSession {
		user?: User;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		userToken: string;
		picture: string;
		id: string;
		accessToken: string;
		accessTokenExpires: number;
		refreshToken: string;
	}
}
