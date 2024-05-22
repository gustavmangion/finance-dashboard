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
import { useAppSelector } from "../hooks/reduxHook";
import { setFirstUploadDone, setUser } from "../stores/userSlice";
import BankName from "./bankName";

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
	const [uploadError, setUploadError] = useState(false);
	const [statementAlreadyUploaded, setStatementsAlreadyUploaded] =
		useState(false);

	const dispatch = useDispatch();
	const user = useAppSelector((state) => state.userReducer.user);
	const [uploadStatement] = useUploadStatementMutation();

	useEffect(() => {
		if (authStatus == AuthStatus.NotAuthorized) return router.push("/");
	});

	useEffect(() => {
		if (uploadFiles.length > 0 && uploadDone) {
			if (uploadIndex < uploadFiles.length) {
				setFormStep(1);
				uploadStatement(uploadFiles[uploadIndex]).then((result) => {
					if ("data" in result) {
						const response: UploadStatementResponse = result.data;
						if (
							response.statementAlreadyUploaded &&
							uploadIndex + 1 === uploadFiles.length
						) {
							setStatementsAlreadyUploaded(true);
							setUploadIndex(uploadIndex + 1);
						} else if (response.needPassword) {
							setFormStep(2);
							setFileId(response.uploadId);
							setUploadDone(false);
						} else if (response.needBankName) {
							setFormStep(3);
							setFileId(response.uploadId);
							setAccountsToBeSetup(response.accountsToSetup);
							setUploadDone(false);
						} else if (response.accountsToSetup.length > 0) {
							setFormStep(4);
							setFileId(response.uploadId);
							setAccountsToBeSetup(response.accountsToSetup);
							setUploadDone(false);
						} else if (uploadIndex + 1 === uploadFiles.length) {
							if (user?.userStatus === 2) dispatch(setFirstUploadDone());

							setModalOpen(true);
						} else setUploadIndex(uploadIndex + 1);
					} else {
						setUploadError(true);
						setModalOpen(true);
						dispatch(displayError("File wasn't upload, please try again"));
					}
				});
			} else {
				if (user?.userStatus === 2) dispatch(setFirstUploadDone());

				setModalOpen(true);
			}
		}
	}, [uploadIndex, dispatch, uploadFiles, uploadStatement, uploadDone, user]);

	if (authStatus == AuthStatus.Loading) return <LoadingSkeleton />;

	if (authStatus == AuthStatus.Authorized)
		return (
			<div className="container">
				{uploadFiles.length === 0 ? (
					<h2>Upload your bank statements</h2>
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
						setStatementAlreadyUploaded={setStatementsAlreadyUploaded}
					/>
				) : formStep === 3 ? (
					<BankName
						fileId={fileId}
						setFormStep={setFormStep}
						setAccountsToBeSetup={setAccountsToBeSetup}
						handleNextFile={HandleNextFile}
						setStatementAlreadyUploaded={setStatementsAlreadyUploaded}
					/>
				) : (
					<CreateAccount
						uploadId={fileId}
						accountsToBeSetup={accountsToBeSetup}
						handleNextFile={HandleNextFile}
					/>
				)}
				<UploadSuccessModal
					modalOpen={modalOpen}
					multipleStatements={uploadFiles.length > 1}
					statementAlreadyUploaded={statementAlreadyUploaded}
					uploadError={uploadError}
					reset={Reset}
				/>
			</div>
		);

	function HandleNextFile(uploadError: boolean) {
		setUploadIndex(uploadIndex + 1);
		setUploadDone(true);
		setUploadError(uploadError);
	}

	function Reset() {
		setUploadIndex(0);
		setUploadFiles([]);
		setFormStep(0);
		setFileId("");
		setAccountsToBeSetup([]);
		setStatementsAlreadyUploaded(false);
		setUploadError(false);
		setModalOpen(false);
	}
}
