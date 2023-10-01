import { Box, Button, CircularProgress, Modal, Paper } from "@mui/material";
import materialStyles from "../../styles/material.module.scss";
import { useGetUserShareCodeQuery } from "@/app/apis/base/user/userService";

type Props = {
	modalOpen: boolean;
	setModalOpen: (value: boolean) => void;
};

export default function ViewShareCodeModal({ modalOpen, setModalOpen }: Props) {
	const { isLoading, isFetching, data } = useGetUserShareCodeQuery(null);

	return (
		<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
			<Paper className={materialStyles.modal}>
				{isLoading || isFetching ? (
					<CircularProgress />
				) : (
					<>
						<h4>Your code is {data?.code}</h4>
						<p>Share this code along with the invite code</p>
						<Box className={materialStyles.buttonsContainer}>
							<Button variant="contained" onClick={() => setModalOpen(false)}>
								Close
							</Button>
						</Box>
					</>
				)}
			</Paper>
		</Modal>
	);
}
