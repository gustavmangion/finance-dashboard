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
};

export default function NameValueListCard({ title, loading, data }: Props) {
	return (
		<Card className={[styles.card, styles.nameValueCard].join(" ")}>
			<CardContent className={styles.medium}>
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
		console.log(data);
		return (
			<List
				sx={{
					overflow: "auto",
				}}
				dense
			>
				{data!.map((row) => (
					<ListItem key={row.name}>
						<ListItemText className={styles.name} primary={row.name} />
						<ListItemText primary={getMoneyFormat(row.value)} />
					</ListItem>
				))}
			</List>
		);
	}
}
