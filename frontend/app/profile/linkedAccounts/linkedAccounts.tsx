import { Alert, Button, CircularProgress } from "@mui/material";
import { useGetUserSharesQuery } from "../../apis/base/user/userService";
import CreateOrUpdateShareCodeModal from "./createOrUpdateShareCodeModal";
import { useState } from "react";

export default function LinkedAccounts() {
	const [shareCodeModalOpen, setShareCodeModalOpen] = useState(false);

	const { isLoading, isFetching, data } = useGetUserSharesQuery(null);

	if (isFetching || isLoading) return <CircularProgress />;

	return (
		<>
			<div>
				<Button onClick={() => setShareCodeModalOpen(true)}>
					{data?.shareCodeSetup ? "Update code" : "Create new code"}
				</Button>
				{data?.shareCodeSetup ? <Button>View code</Button> : null}
			</div>
			<div>
				{!data?.shareCodeSetup ? (
					<Alert
						severity="info"
						sx={{ display: "flex", justifyContent: "center" }}
					>
						Setup a code before linking new accounts
					</Alert>
				) : data.userShares.length < 1 ? (
					<Alert
						severity="info"
						sx={{ display: "flex", justifyContent: "center" }}
					>
						No linked accounts
					</Alert>
				) : (
					getLinkedAccounts()
				)}
			</div>
			<CreateOrUpdateShareCodeModal
				modalOpen={shareCodeModalOpen}
				newCode={!data!.shareCodeSetup}
				setModalOpen={setShareCodeModalOpen}
			/>
		</>
	);

	function getLinkedAccounts() {
		return <div></div>;
	}
}
