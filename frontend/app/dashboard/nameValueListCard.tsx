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
import NameValueListModal from "./drilldown/nameValueListModal";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
	width?: number;
	disableExpand?: boolean;
	showCount?: boolean;
	drillDownAction?: (id: string) => void;
};

export default function NameValueListCard({
	title,
	loading,
	data,
	width = 1,
	disableExpand = false,
	showCount = false,
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
			<NameValueListModal
				open={expanded}
				title={title}
				loading={loading}
				data={data}
				showCount={showCount}
				setOpen={(x) => setExpanded(x)}
				drillDownAction={drillDownAction}
			/>
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
}
