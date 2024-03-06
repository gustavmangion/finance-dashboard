import {
	Button,
	CircularProgress,
	IconButton,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { getMoneyFormat } from "../../helpers/moneyHelper";
import styles from "../../styles/dashboard.module.scss";
import materialStyles from "../../styles/material.module.scss";
import LoadError from "../loadError";
import NoData from "../noData";
import Transaction from "@/app/apis/base/transaction/types";

type Props = {
	open: boolean;
	title: string;
	loading: boolean;
	data: Transaction[] | undefined;
	drillDown?: boolean;
	setOpen: (open: boolean) => void;
	drillDownAction?: (id: string) => void;
};

export default function TransactionListModal({
	open,
	title,
	loading,
	data,
	drillDown = false,
	setOpen,
	drillDownAction,
}: Props) {
	console.log(loading);
	console.log(data);
	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<Paper className={[materialStyles.modal, styles.expandList].join(" ")}>
				<div className={styles.header}>
					<h3>{title}</h3>
					<h5>Displaying the 30 biggest transactions</h5>
					<div>
						<Button size="small" onClick={() => setOpen(false)}>
							<CloseIcon />
						</Button>
					</div>
				</div>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : data === undefined ? (
					<LoadError />
				) : data.length === 0 ? (
					<NoData />
				) : (
					getList()
				)}
			</Paper>
		</Modal>
	);

	function getList() {
		return (
			<TableContainer>
				<Table stickyHeader size="small">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Amount</TableCell>
							{drillDown && drillDownAction ? (
								<TableCell>Details</TableCell>
							) : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{data!.map((row) => (
							<TableRow key={row.id}>
								<TableCell>{row.tranDate}</TableCell>
								<TableCell>{row.description}</TableCell>
								<TableCell>{getMoneyFormat(row.amount * -1)}</TableCell>
								{drillDown && drillDownAction ? (
									<TableCell>
										<IconButton
											size="small"
											color="primary"
											onClick={() => drillDownAction(row.id)}
										>
											<AnalyticsIcon />
										</IconButton>
									</TableCell>
								) : null}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}
