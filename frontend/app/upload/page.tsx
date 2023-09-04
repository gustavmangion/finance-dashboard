"use client";

import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/loadingSkeleton";
import { AuthStatus } from "../enums/authStatusEnum";
import { useSecurePage } from "../hooks/authHook";
import { useRouter } from "next/navigation";
import React from "react";
import SelectFile from "./selectFile";
import CreateAccount from "./createAccount";
import FilePassword from "./filePassword";

export default function UploadPage() {
	const authStatus = useSecurePage();
	const router = useRouter();

	const [formStep, setFormStep] = useState(0);
	const [fileId, setFileId] = useState("");
	const [accountsToBeSetup, setAccountsToBeSetup] = useState<string[]>([]);

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				<h2>Upload your bank statement</h2>
				{formStep === 0 ? (
					<SelectFile setFormStep={setFormStep} setFileId={setFileId} />
				) : formStep === 1 ? (
					<FilePassword
						fileId={fileId}
						setFormStep={setFormStep}
						setAccountsToBeSetup={setAccountsToBeSetup}
						setFileId={setFileId}
					/>
				) : (
					<CreateAccount
						uploadId={fileId}
						setFormStep={setFormStep}
						setFileId={setFileId}
						accountsToBeSetup={accountsToBeSetup}
					/>
				)}
			</div>
		);
}
