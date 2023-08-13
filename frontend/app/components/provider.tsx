"use client";

import { SessionProvider } from "next-auth/react";
import { store } from "../stores/store";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<SessionProvider>{children}</SessionProvider>
		</Provider>
	);
}
