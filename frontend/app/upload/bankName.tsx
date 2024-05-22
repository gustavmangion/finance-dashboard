import {
	Box,
	Button,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import styles from "../styles/upload.module.scss";
import materialStyles from "../styles/material.module.scss";
import { SyntheticEvent, useState } from "react";
import { SetBank, UploadStatementResponse } from "../apis/base/upload/types";
import {
	useGetBanksQuery,
	useSetBankMutation,
} from "../apis/base/upload/uploadService";
import { useDispatch } from "react-redux";
import { displayError } from "../stores/notificationSlice";
import UploadingSpinner from "./uploadingSpinner";
import Image from "next/image";

type Props = {
	fileId: string;
	statementFirstPage: Uint8Array;
	setFormStep: (val: number) => void;
	setBankId: (val: string) => void;
	setAccountsToBeSetup: (val: string[]) => void;
	handleNextFile: (uploadError: boolean) => void;
	setStatementAlreadyUploaded: (val: boolean) => void;
};

export default function BankName({
	fileId,
	statementFirstPage,
	setFormStep,
	setBankId,
	setAccountsToBeSetup,
	handleNextFile,
	setStatementAlreadyUploaded,
}: Props) {
	const [bankInput, setBankInput] = useState("");
	const [loading, setLoading] = useState(false);

	const { data, isLoading, isFetching } = useGetBanksQuery(null);

	const dispatch = useDispatch();
	const [setBank] = useSetBankMutation();

	return (
		<div className={styles.newAccount}>
			{loading || isLoading || isFetching ? (
				<UploadingSpinner />
			) : (
				<>
					<h3>Chose statement bank</h3>
					<form onSubmit={handleSubmit}>
						<Select
							name="bank"
							label="Statement Bank"
							variant="standard"
							onChange={handleChange}
							value={bankInput}
							required
							placeholder="Bank"
						>
							{mapBankOptions()}
						</Select>
						<Image
							className={styles.statementView}
							alt="First page of statement"
							src={"data:image/png;base64," + statementFirstPage.toString()}
							width={0}
							height={0}
							sizes="100%"
							style={{ width: "80%", height: "auto" }}
						/>
						<Box className={materialStyles.buttonsContainer}>
							<Button variant="contained" type="submit">
								Next
							</Button>
						</Box>
					</form>
				</>
			)}
		</div>
	);

	function mapBankOptions() {
		const options: React.ReactElement[] = [];
		data!.map((x) => {
			options.push(
				<MenuItem key={x.id} value={x.id}>
					{x.name}
				</MenuItem>
			);
		});

		return options;
	}

	function handleChange(e: SelectChangeEvent) {
		setBankInput(e.target.value);
	}

	function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const setBankModel: SetBank = new SetBank();
		setBankModel.uploadId = fileId;
		setBankModel.bankId = bankInput;

		setBank(setBankModel).then((result) => {
			if ("data" in result) {
				const response: UploadStatementResponse = result.data;
				if (response.statementAlreadyUploaded) {
					setStatementAlreadyUploaded(true);
					handleNextFile(false);
				} else if (response.accountsToSetup.length === 0) handleNextFile(false);
				else {
					setAccountsToBeSetup(response.accountsToSetup);
					setBankId(response.bankId);
					setFormStep(4);
				}
			} else {
				dispatch(displayError(null));
				handleNextFile(true);
			}
			setLoading(false);
		});
	}
}
