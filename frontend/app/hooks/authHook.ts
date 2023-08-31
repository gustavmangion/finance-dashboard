import { useSession } from "next-auth/react";
import { AuthStatus } from "../enums/authStatusEnum";
import User from "../apis/base/user/types";
import { useAppSelector } from "./reduxHook";
import { usePathname, useRouter } from "next/navigation";

export const useSecurePage = (): AuthStatus => {
	const session = useSession();
	const pathName = usePathname();
	const user: User | undefined = useAppSelector(
		(state) => state.userReducer.user
	);

	if (!session || session.status === "loading") return AuthStatus.Loading;
	else if (session.status === "unauthenticated")
		return AuthStatus.NotAuthorized;
	else if (pathName !== "/" && (user == undefined || user.setupNeeded))
		return AuthStatus.NotAuthorized;
	else return AuthStatus.Authorized;
};
