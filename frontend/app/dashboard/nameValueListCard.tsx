import {
	Button,
	Card,
	CardContent,
	CircularProgress,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { NameValueModel } from "../apis/base/dashboard/types";
import styles from "../styles/dashboard.module.scss";
import materialStyles from "../styles/material.module.scss";
import NoData from "./noData";
import LoadError from "./loadError";
import { getMoneyFormat } from "../helpers/moneyHelper";
import { useState } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import AnalyticsIcon from "@mui/icons-material/Analytics";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
	width?: number;
	disableExpand?: boolean;
	drillDown?: boolean;
	drillDownAction?: (id: string) => void;
};

export default function NameValueListCard({
	title,
	loading,
	data,
	width = 1,
	disableExpand = false,
	drillDown = false,
	drillDownAction,
}: Props) {
	let widthClass = styles.normalWide;
	if (width === 2) widthClass = styles.doubleWide;

	const [expanded, setExpanded] = useState(false);

	return (
		<Card className={[styles.card, styles.nameValueCard].join(" ")}>
			<CardContent className={[styles.medium, styles.normalWide].join(" ")}>
				<h4 onClick={handleExpandClick}>
					{title}
					{!disableExpand ? (
						<OpenInFullIcon className={styles.expandIcon} />
					) : null}
				</h4>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : data === undefined ? (
					<LoadError />
				) : data.length === 0 ? (
					<NoData />
				) : (
					getList()
				)}
			</CardContent>
			<Modal open={expanded} onClose={() => setExpanded(false)}>
				<Paper className={[materialStyles.modal, styles.expandList].join(" ")}>
					<div className={styles.header}>
						<h3>{title}</h3>
						<div>
							<Button size="small" onClick={() => setExpanded(false)}>
								<CloseIcon />
							</Button>
						</div>
					</div>
					{data !== undefined ? getModalList() : null}
				</Paper>
			</Modal>
		</Card>
	);

	function getList() {
		return (
			<List
				sx={{
					overflow: "auto",
				}}
				dense
			>
				{data!.map((row) => (
					<ListItem key={row.name}>
						<ListItemText
							primary={row.name}
							secondary={getMoneyFormat(row.value)}
						/>
					</ListItem>
				))}
			</List>
		);
	}

	function handleExpandClick() {
		if (!disableExpand && !loading) setExpanded(true);
	}

	function getModalList() {
		return (
			<TableContainer>
				<Table stickyHeader size="small">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Amount</TableCell>
							{drillDown && drillDownAction ? (
								<TableCell>Details</TableCell>
							) : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{data!.map((row) => (
							<TableRow key={row.name}>
								<TableCell>{row.name}</TableCell>
								<TableCell>{getMoneyFormat(row.value)}</TableCell>
								{drillDown && drillDownAction ? (
									<TableCell>
										<IconButton
											size="small"
											color="primary"
											onClick={() => drillDownAction(row.name)}
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
