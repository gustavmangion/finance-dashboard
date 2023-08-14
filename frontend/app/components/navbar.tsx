"use client";

import styles from "../styles/navbar.module.scss";
import { signIn, useSession } from "next-auth/react";
import {
	AppBar,
	Avatar,
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { closeDrawer, openDrawer } from "../stores/navBarSlice";
import Link from "next/link";

export default function Navbar() {
	const { data: session } = useSession();
	const drawerOpen: boolean = useAppSelector(
		(state) => state.navBarReducer.drawerOpen
	);
	const dispatch = useAppDispatch();

	const handleDrawerToggle = () => {
		drawerOpen ? dispatch(closeDrawer()) : dispatch(openDrawer());
	};

	const navItems = ["Dashboard", "Upload"];

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

	return (
		<>
			<AppBar position="sticky" component="nav">
				<Toolbar className={styles.navbar}>
					<IconButton
						onClick={handleDrawerToggle}
						aria-label="open drawer"
						className={styles.drawerToggle}
					>
						<MenuIcon />
					</IconButton>
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
					{session ? (
						<div>
							<Avatar
								className={styles.userIcon}
								alt="Profile picture"
								src={session.user?.image as string}
							/>
						</div>
					) : (
						<></>
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
}
