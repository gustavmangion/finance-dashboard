import {
	Alert,
	Button,
	CircularProgress,
	Divider,
	List,
	ListItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useGetUserSharesQuery } from "../../apis/base/user/userService";
import CreateOrUpdateShareCodeModal from "./createOrUpdateShareCodeModal";
import { useState } from "react";
import ViewShareCodeModal from "./viewShareCodeModal";
import CreateInviteModal from "./createInviteModal";
import { UserShare } from "@/app/apis/base/user/types";
import { LoadingButton } from "@mui/lab";

export default function LinkedAccounts() {
	const [shareCodeModalOpen, setShareCodeModalOpen] = useState(false);
	const [viewCodeModalOpen, setViewCodeModalOpen] = useState(false);
	const [inviteModalOpen, setInviteModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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
			{data?.shareCodeSetup ? (
				<div>
					<Divider />
					<Button onClick={() => setInviteModalOpen(true)}>
						Create Invite
					</Button>
					<Button>Accept Invite</Button>
				</div>
			) : null}
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
			<CreateInviteModal
				modalOpen={inviteModalOpen}
				setModalOpen={setInviteModalOpen}
			/>
		</>
	);

	function getLinkedAccounts() {
		return (
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Invite Status</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<>
							{data!.userShares.map((share: UserShare) => {
								return (
									<TableRow key={share.id}>
										<TableCell>{share.alias}</TableCell>
										<TableCell>
											{share.revoked
												? "Revoked"
												: share.inviteCode === -1
												? "Accepted"
												: `${share.inviteCode} - Pending`}
										</TableCell>
										<TableCell>
											<LoadingButton>
												{share.revoked ? "Remove" : "Revoke"}
											</LoadingButton>
										</TableCell>
									</TableRow>
								);
							})}
						</>
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}
