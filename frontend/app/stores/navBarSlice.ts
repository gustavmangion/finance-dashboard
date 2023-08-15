import { createSlice } from "@reduxjs/toolkit";

type NavBarState = {
	drawerOpen: boolean;
	userMenuOpen: boolean;
};

const initialState = {
	drawerOpen: false,
	userMenuOpen: false,
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
		closeUserMenu: (state: any) => {
			state.userMenuOpen = false;
		},
		openUserMenu: (state: any) => {
			state.userMenuOpen = true;
		},
	},
});

export const { closeDrawer, openDrawer, closeUserMenu, openUserMenu } =
	navBar.actions;

export default navBar.reducer;
