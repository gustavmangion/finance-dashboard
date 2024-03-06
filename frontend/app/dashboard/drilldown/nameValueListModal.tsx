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
import { NameValueModel } from "@/app/apis/base/dashboard/types";

type Props = {
	open: boolean;
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
	showCount?: boolean;
	source?: string;
	setOpen: (open: boolean) => void;
	drillDownAction?: (id: string, source: string) => void;
};

export default function NameValueListModal({
	open,
	title,
	loading,
	data,
	showCount = false,
	source,
	setOpen,
	drillDownAction,
}: Props) {
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
							<TableCell>Name</TableCell>
							<TableCell>Amount</TableCell>
							{showCount ? <TableCell>Count</TableCell> : null}
							{drillDownAction && source ? (
								<TableCell>Details</TableCell>
							) : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{data!.map((row) => (
							<TableRow key={row.name}>
								<TableCell>{row.name}</TableCell>
								<TableCell>{getMoneyFormat(row.value)}</TableCell>
								{showCount ? <TableCell>{row.count}</TableCell> : null}
								{drillDownAction && source ? (
									<TableCell>
										<IconButton
											size="small"
											color="primary"
											onClick={() => drillDownAction(row.name, source!)}
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
