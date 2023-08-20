import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";

declare module "next-auth" {
	interface User {
		accessToken: string;
	}

	interface Session extends DefaultSession {
		user?: User;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		accessToken: string;
		id: string;
		user: {
			accessToken: string;
		};
	}
}
