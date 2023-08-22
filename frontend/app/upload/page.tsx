"use client";

import { useEffect } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { useUploadStatementMutation } from "../apis/base/upload/uploadService";
import { UploadStatement } from "../apis/base/upload/types";
import { useSession } from "next-auth/react";
import React from "react";

export default function UploadPage() {
	const authStatus = useSecurePage();
	const router = useRouter();
	const [addStatement, response] = useUploadStatementMutation();

	const session = useSession();

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				Upload page <Button onClick={uploadStatement}>Upload</Button>
			</div>
		);

	async function uploadStatement() {
		const data = new UploadStatement();

		data.account = "Hi test";
		console.log(await addStatement(data));
	}
}
