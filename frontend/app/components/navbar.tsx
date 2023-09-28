"use client";

import styles from "../styles/navbar.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import {
	closeDrawer,
	openDrawer,
	closeUserMenu,
	openUserMenu,
} from "../stores/navBarSlice";
import { resetUser } from "../stores/userSlice";
import Link from "next/link";
import React from "react";

export default function Navbar() {
	const { data: session } = useSession();
	const [userMenuAnchor, setUserMenuAnchor] =
		React.useState<null | HTMLElement>(null);
	const drawerOpen: boolean = useAppSelector(
		(state) => state.navBarReducer.drawerOpen
	);
	const userMenuOpen: boolean = useAppSelector(
		(state) => state.navBarReducer.userMenuOpen
	);
	const dispatch = useAppDispatch();

	const handleDrawerToggle = () => {
		drawerOpen ? dispatch(closeDrawer()) : dispatch(openDrawer());
	};

	const handleUserMenuToggle = (e: any) => {
		if (userMenuOpen) {
			setUserMenuAnchor(null);
			dispatch(closeUserMenu());
		} else {
			setUserMenuAnchor(e.currentTarget);
			dispatch(openUserMenu());
		}
	};

	const navItems = ["Dashboard", "Upload", "Accounts"];

	const drawer = (
		<Box onClick={handleDrawerToggle} className={styles.drawer}>
			<div className={styles.drawerHeader}></div>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item} disablePadding>
						<ListItemButton>
							<Link href={`/${item.toLowerCase()}`} className={styles.navLink}>
								<ListItemText primary={item} />
							</Link>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	const userMenu = (
		<Menu
			id="user-menu"
			open={userMenuOpen}
			onClose={handleUserMenuToggle}
			anchorEl={userMenuAnchor}
		>
			<MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
		</Menu>
	);

	return (
		<>
			<AppBar position="sticky" component="nav">
				<Toolbar className={styles.navbar}>
					{session ? (
						<IconButton
							onClick={handleDrawerToggle}
							aria-label="open drawer"
							className={styles.drawerToggle}
						>
							<MenuIcon />
						</IconButton>
					) : (
						<></>
					)}
					<div className={styles.logo}>
						<Link href="/">
							<Image
								alt="Logo"
								src="/logo.png"
								width={0}
								height={0}
								sizes="100%"
								style={{ width: "auto", height: "100%" }}
							/>
						</Link>
					</div>
					{session ? (
						<>
							<div className={styles.navLinks}>
								{navItems.map((item) => (
									<Link
										key={item}
										href={`/${item.toLowerCase()}`}
										className={styles.navLink}
									>
										{item}
									</Link>
								))}
							</div>

							<div>
								<Avatar
									id="avatar"
									className={styles.userIcon}
									alt="Profile picture"
									src={session.user?.picture as string}
									onClick={handleUserMenuToggle}
								>
									{session.user?.name?.substring(0, 1)}
								</Avatar>
								{userMenu}
							</div>
						</>
					) : (
						<Button
							variant="contained"
							className={styles.signIn}
							onClick={() => signIn("google")}
						>
							Sign In
						</Button>
					)}
				</Toolbar>
			</AppBar>
			<Drawer
				variant="temporary"
				open={drawerOpen}
				onClose={handleDrawerToggle}
				keepMounted
			>
				{drawer}
			</Drawer>
		</>
	);

	function handleSignOut() {
		dispatch(resetUser());
		signOut();
	}
}
