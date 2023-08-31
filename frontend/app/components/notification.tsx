"use client";

import { Snackbar } from "@mui/material";
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
			message={state.message}
		/>
	);
}

export enum NotificationType {
	Error = "error",
	Info = "info",
	Success = "success",
}
