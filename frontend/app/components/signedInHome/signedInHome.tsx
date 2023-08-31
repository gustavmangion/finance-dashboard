"use client";

import Image from "next/image";
import styles from "../../styles/dashboard.module.scss";
import { useGetUserQuery } from "../../apis/base/user/userService";
import LoadingSkeleton from "../loadingSkeleton";
import { useAppSelector } from "@/app/hooks/reduxHook";
import User from "@/app/apis/base/user/types";
import SetupUser from "./setupUser";
import HomeMenu from "./homeMenu";

export default function SignedInHome() {
	const user: User | undefined = useAppSelector(
		(state) => state.userReducer.user
	);

	const { isLoading, isFetching, data, error } = useGetUserQuery(null);

	if (isLoading || isFetching) return <LoadingSkeleton />;

	return (
		<div className="container">
			<div className={styles.homeHeader}>
				<h1>
					Welcome to QasQuz
					<Image
						src="/logo.png"
						alt="logo"
						width={0}
						height={0}
						sizes="100%"
						style={{ width: "auto", height: "100%" }}
					/>
				</h1>
				<h2>Your smart piggy bank assistant</h2>
			</div>
			{isLoading || isFetching ? (
				<LoadingSkeleton />
			) : user?.setupNeeded ? (
				<SetupUser />
			) : (
				<HomeMenu />
			)}
		</div>
	);
}
