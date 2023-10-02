"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { persistor, store } from "../stores/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";

export default function Providers({ children }: { children: React.ReactNode }) {
	const theme = createTheme({
		palette: {
			mode: "light",
			primary: {
				main: "#1c5d99",
			},
			secondary: {
				main: "#82c0d2",
			},
			error: {
				main: "#c12c0d",
			},
		},
	});

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
					<SessionProvider>
						<ThemeProvider theme={theme}>{children}</ThemeProvider>
					</SessionProvider>
				</LocalizationProvider>
			</PersistGate>
		</Provider>
	);
}
