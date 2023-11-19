import {
	Card,
	CardContent,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { NameValueModel } from "../apis/base/dashboard/types";
import styles from "../styles/dashboard.module.scss";
import NoData from "./noData";
import LoadError from "./loadError";
import { getMoneyFormat } from "../helpers/moneyHelper";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
	width?: number;
};

export default function NameValueListCard({
	title,
	loading,
	data,
	width = 1,
}: Props) {
	let widthClass = styles.normalWide;
	if (width === 2) widthClass = styles.doubleWide;

	return (
		<Card className={[styles.card, styles.nameValueCard].join(" ")}>
			<CardContent className={[styles.medium, styles.normalWide].join(" ")}>
				<h4>{title}</h4>
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
}
