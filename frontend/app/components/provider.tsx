"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { persistor, store } from "../stores/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
					<SessionProvider>{children}</SessionProvider>
				</LocalizationProvider>
			</PersistGate>
		</Provider>
	);
}
