"use client";

import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useRouter } from "next/navigation";
import { useUploadStatementMutation } from "../apis/base/upload/uploadService";
import { UploadStatement } from "../apis/base/upload/types";
import React from "react";
import SelectFile from "./selectFile";

export default function UploadPage() {
	const authStatus = useSecurePage();
	const router = useRouter();
	const [addStatement, response] = useUploadStatementMutation();

	const [formState, setFormState] = useState({
		step: 0,
	});

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				<h2>Upload your bank statement</h2>
				{formState.step === 0 ? <SelectFile /> : null}
			</div>
		);
}
