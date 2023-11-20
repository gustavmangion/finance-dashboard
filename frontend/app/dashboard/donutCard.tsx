import { Card, CardContent, CircularProgress } from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import Chart from "react-google-charts";
import { NameValueModel } from "../apis/base/dashboard/types";
import LoadError from "./loadError";
import NoData from "./noData";
import { getMoneyFormat } from "../helpers/moneyHelper";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
};

export default function DonutCard({ title, loading, data }: Props) {
	const chartHeader = [["Expense", "Amount"]];
	const chartData =
		data === undefined
			? []
			: data.map((row) => {
					return [
						row.name,
						parseFloat((Math.round(row.value * 100) / 100).toString()),
					];
			  });
	return (
		<Card className={styles.card}>
			<CardContent className={[styles.tall, styles.doubleWide].join(" ")}>
				<h4>{title}</h4>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : data === undefined ? (
					<LoadError />
				) : data.length === 0 ? (
					<NoData />
				) : (
					<Chart
						chartType="PieChart"
						data={[...chartHeader, ...chartData]}
						options={{
							chartArea: { width: "100%", height: "90%" },
							pieHole: 0.4,
						}}
					/>
				)}
			</CardContent>
		</Card>
	);
}
