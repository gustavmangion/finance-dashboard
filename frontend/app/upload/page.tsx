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
import UploadingSpinner from "./uploadingSpinner";
import { useUploadStatementMutation } from "../apis/base/upload/uploadService";
import { UploadStatementResponse } from "../apis/base/upload/types";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";
import UploadSuccessModal from "./uploadSuccessModal";

export default function UploadPage() {
	const authStatus = useSecurePage();
	const router = useRouter();

	const [formStep, setFormStep] = useState(0);
	const [fileId, setFileId] = useState("");
	const [accountsToBeSetup, setAccountsToBeSetup] = useState<string[]>([]);
	const [uploadFiles, setUploadFiles] = useState<File[]>([]);
	const [uploadIndex, setUploadIndex] = useState(0);
	const [uploadDone, setUploadDone] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);

	const dispatch = useDispatch();
	const [uploadStatement] = useUploadStatementMutation();

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	useEffect(() => {
		if (uploadFiles.length > 0 && uploadDone) {
			if (uploadIndex < uploadFiles.length) {
				setFormStep(1);
				console.log("here");
				uploadStatement(uploadFiles[uploadIndex]).then((result) => {
					if ("data" in result) {
						const response: UploadStatementResponse = result.data;
						if (response.needPassword) {
							setFormStep(2);
							setFileId(response.uploadId);
							setUploadDone(false);
						} else if (response.accountsToSetup.length > 0) {
							setFormStep(3);
							setFileId(response.uploadId);
							setAccountsToBeSetup(response.accountsToSetup);
							setUploadDone(false);
						} else if (uploadIndex + 1 === uploadFiles.length)
							setModalOpen(true);
						else setUploadIndex(uploadIndex + 1);
					} else dispatch(displayError("File wasn't upload, please try again"));
				});
			} else setModalOpen(true);
		}
	}, [uploadIndex, dispatch, uploadFiles, uploadStatement, uploadDone]);

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				{uploadFiles.length === 0 ? (
					<h2>Upload your bank statement</h2>
				) : (
					<h3>
						Uploading statement {uploadIndex + 1} of {uploadFiles.length}
					</h3>
				)}
				{formStep === 0 ? (
					<SelectFile setUploadFiles={setUploadFiles} />
				) : formStep === 1 ? (
					<UploadingSpinner />
				) : formStep === 2 ? (
					<FilePassword
						fileId={fileId}
						setFormStep={setFormStep}
						setAccountsToBeSetup={setAccountsToBeSetup}
						handleNextFile={HandleNextFile}
					/>
				) : (
					<CreateAccount
						uploadId={fileId}
						setFormStep={setFormStep}
						setFileId={setFileId}
						accountsToBeSetup={accountsToBeSetup}
						handleNextFile={HandleNextFile}
					/>
				)}
				<UploadSuccessModal
					modalOpen={modalOpen}
					setFileId={setFileId}
					setFormStep={setFormStep}
				/>
			</div>
		);

	function HandleNextFile() {
		setUploadIndex(uploadIndex + 1);
		setUploadDone(true);
	}
}
