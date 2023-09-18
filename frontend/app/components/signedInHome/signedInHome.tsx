"use client";

import Image from "next/image";
import styles from "../../styles/home.module.scss";
import { useGetUserQuery } from "../../apis/base/user/userService";
import LoadingSkeleton from "../loadingSkeleton";
import { useAppSelector } from "@/app/hooks/reduxHook";
import SetupUser from "./setupUser";
import HomeMenu from "./homeMenu";
import { useGetPortfoliosQuery } from "@/app/apis/base/portfolio/portfolioService";

export default function SignedInHome() {
	const state = useAppSelector((state) => state.userReducer);

	const { isLoading: userIsLoading, isFetching: userIsFetching } =
		useGetUserQuery(null);
	const { isLoading: portfoliosIsLoading, isFetching: portfoliosIsFetching } =
		useGetPortfoliosQuery(null);

	if (
		userIsLoading ||
		userIsFetching ||
		portfoliosIsLoading ||
		portfoliosIsFetching
	)
		return <LoadingSkeleton />;

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
			{state.user?.setupNeeded || state.needUploadStatement ? (
				<SetupUser />
			) : (
				<HomeMenu />
			)}
		</div>
	);
}
