"use client";

import { Alert, Snackbar } from "@mui/material";
import { useAppSelector } from "../hooks/reduxHook";
import { useDispatch } from "react-redux";
import NotificationState, {
	hideNotification,
} from "../stores/notificationSlice";

export default function Notification() {
	const dispatch = useDispatch();
	const state = useAppSelector((state) => state.notificationReducer);
	return (
		<Snackbar
			open={state.open}
			autoHideDuration={5000}
			onClose={() => dispatch(hideNotification())}
		>
			<Alert onClose={() => dispatch(hideNotification())} severity={state.type}>
				{state.message}
			</Alert>
		</Snackbar>
	);
}

export enum NotificationType {
	Error = "error",
	Info = "info",
	Success = "success",
}
