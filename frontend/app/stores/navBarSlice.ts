import { createSlice } from "@reduxjs/toolkit";

type NavBarState = {
	drawerOpen: boolean;
};

const initialState = {
	drawerOpen: false,
} as NavBarState;

export const navBar = createSlice({
	name: "navbar",
	initialState,
	reducers: {
		closeDrawer: (state: any) => {
			state.drawerOpen = false;
		},
		openDrawer: (state: any) => {
			state.drawerOpen = true;
		},
	},
});

export const { closeDrawer, openDrawer } = navBar.actions;

export default navBar.reducer;
