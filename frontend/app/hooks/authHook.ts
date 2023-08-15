import { useSession } from "next-auth/react";
import { AuthStatus } from "../enums/authStatusEnum";

export const useSecurePage = (): AuthStatus => {
	const session = useSession();

	if (!session || session.status === "loading") return AuthStatus.Loading;
	else if (session.status === "unauthenticated") {
		return AuthStatus.NotAuthorized;
	} else return AuthStatus.Authorized;
};
