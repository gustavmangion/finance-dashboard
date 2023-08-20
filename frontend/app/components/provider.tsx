"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { persistor, store } from "../stores/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			{/* <PersistGate loading={null} persistor={persistor}> */}
			<SessionProvider>{children}</SessionProvider>
			{/* </PersistGate> */}
		</Provider>
	);
}
