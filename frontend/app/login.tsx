"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { UserCard } from "./userCard";

export default function Login() {
	const { data: session } = useSession();
	console.log(session);

	if (session) {
		return (
			<>
				<button onClick={() => signOut()} type="button">
					Sign out
				</button>
				<UserCard user={session?.user} />
			</>
		);
	} else {
		return (
			<>
				<button onClick={() => signIn()} type="button">
					Sign in
				</button>
			</>
		);
	}
}
