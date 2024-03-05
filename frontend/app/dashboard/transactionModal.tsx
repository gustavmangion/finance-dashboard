import { Button, CircularProgress, Modal, Paper } from "@mui/material";
import materialStyles from "../styles/material.module.scss";
import styles from "../styles/dashboard.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import Transaction from "../apis/base/transaction/types";

type Props = {
	expanded: boolean;
	title: string;
	loading: boolean;
	data: Transaction[] | undefined;
	setExpanded: (expanded: boolean) => void;
};

export default function TransactionModal({
	expanded,
	title,
	loading,
	data,
	setExpanded,
}: Props) {
	if (expanded === undefined) return;

	return (
		<Modal open={expanded!} onClose={() => setExpanded(false)}>
			<Paper className={[materialStyles.modal, styles.expandList].join(" ")}>
				<div className={styles.header}>
					<h3>{title}</h3>
					<div>
						<Button size="small" onClick={() => setExpanded(false)}>
							<CloseIcon />
						</Button>
					</div>
					{loading ? (
						<CircularProgress className={styles.spinner} />
					) : (
						<div>data</div>
					)}
				</div>
			</Paper>
		</Modal>
	);
}
