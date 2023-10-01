import { Alert, Button, CircularProgress } from "@mui/material";
import { useGetUserSharesQuery } from "../apis/base/user/userService";

export default function LinkedAccounts() {
	const { isLoading, isFetching, data } = useGetUserSharesQuery(null);

	if (isFetching || isLoading) return <CircularProgress />;

	return (
		<>
			<div>
				<Button>
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
		</>
	);

	function getLinkedAccounts() {
		return <div></div>;
	}
}
