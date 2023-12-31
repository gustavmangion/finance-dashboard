import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NotificationType } from "../components/notification";

export type NotificationState = {
	open: boolean;
	message: string;
	type: NotificationType;
};

const initialState = {
	open: false,
	message: "",
	type: "info",
} as NotificationState;

export const notification = createSlice({
	name: "notification",
	initialState,
	reducers: {
		displayNotification: (state: any, action: PayloadAction<string>) => {
			state.open = true;
			state.message = action.payload;
		},
		displayError: (state: any, action: PayloadAction<string | null>) => {
			state.open = true;
			state.type = NotificationType.Error;
			if (action.payload === null)
				state.message = "An error has occurred, please try again later";
			else state.message = action.payload;
		},
		displaySuccess: (state: any, action: PayloadAction<string>) => {
			state.open = true;
			state.type = NotificationType.Success;
			state.message = action.payload;
		},
		hideNotification: () => initialState,
	},
});

export const {
	displayNotification,
	displayError,
	displaySuccess,
	hideNotification,
} = notification.actions;

export default notification.reducer;
