import { Alert, Button, CircularProgress } from "@mui/material";
import { useGetUserSharesQuery } from "../../apis/base/user/userService";
import CreateOrUpdateShareCodeModal from "./createOrUpdateShareCodeModal";
import { useState } from "react";
import ViewShareCodeModal from "./viewShareCodeModal";

export default function LinkedAccounts() {
	const [shareCodeModalOpen, setShareCodeModalOpen] = useState(false);
	const [viewCodeModalOpen, setViewCodeModalOpen] = useState(false);

	const { isLoading, isFetching, data } = useGetUserSharesQuery(null);

	if (isFetching || isLoading) return <CircularProgress />;

	return (
		<>
			<div>
				<Button onClick={() => setShareCodeModalOpen(true)}>
					{data?.shareCodeSetup ? "Update code" : "Create new code"}
				</Button>
				{data?.shareCodeSetup ? (
					<Button onClick={() => setViewCodeModalOpen(true)}>View code</Button>
				) : null}
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
			<ViewShareCodeModal
				modalOpen={viewCodeModalOpen}
				setModalOpen={setViewCodeModalOpen}
			/>
		</>
	);

	function getLinkedAccounts() {
		return <div></div>;
	}
}
