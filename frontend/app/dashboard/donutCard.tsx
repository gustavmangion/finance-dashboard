import {
	Button,
	Card,
	CardContent,
	CircularProgress,
	Modal,
	Paper,
} from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import materialStyles from "../styles/material.module.scss";
import Chart from "react-google-charts";
import { NameValueModel } from "../apis/base/dashboard/types";
import LoadError from "./loadError";
import NoData from "./noData";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useState } from "react";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
};

export default function DonutCard({ title, loading, data }: Props) {
	const [expanded, setExpanded] = useState(false);

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
				<h4 onClick={handleExpandClick}>
					{title}
					<OpenInFullIcon className={styles.expandIcon} />
				</h4>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : data === undefined ? (
					<LoadError />
				) : data.length === 0 ? (
					<NoData />
				) : (
					GetChart()
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
					{data !== undefined ? GetChart() : null}
				</Paper>
			</Modal>
		</Card>
	);

	function GetChart() {
		return (
			<Chart
				chartType="PieChart"
				data={[...chartHeader, ...chartData]}
				options={{
					chartArea: { width: "100%", height: "90%" },
					pieHole: 0.4,
				}}
			/>
		);
	}

	function handleExpandClick() {
		if (!loading) setExpanded(true);
	}
}
