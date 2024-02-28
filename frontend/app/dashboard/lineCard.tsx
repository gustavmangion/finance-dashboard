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
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useState } from "react";
import { NameValueModel } from "../apis/base/dashboard/types";
import LoadError from "./loadError";
import NoData from "./noData";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
};

export default function LineCard({ title, loading, data }: Props) {
	const [expanded, setExpanded] = useState(false);

	const chartData =
		data === undefined
			? []
			: data
					.map((row) => {
						return {
							name: new Date(row.name.split("/").reverse().join("/")),
							value: parseFloat((Math.round(row.value * 100) / 100).toString()),
						};
					})
					.sort((x, y) => x.name.valueOf() - y.name.valueOf());
	console.log(chartData);
	return (
		<Card className={styles.card}>
			<CardContent
				className={[styles.tall, styles.doubleWide, styles.extraPadding].join(
					" "
				)}
			>
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
					<ResponsiveContainer height="100%" width="100%">
						<LineChart data={chartData}>
							<Line type="monotone" dataKey="value" stroke="#8884d8" />
							<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
						</LineChart>
					</ResponsiveContainer>
				)}
			</CardContent>
			<Modal open={expanded} onClose={() => setExpanded(false)}>
				<Paper className={[materialStyles.modal, styles.expandList].join(" ")}>
					<div className={materialStyles.wide}>
						<div className={styles.header}>
							<h3>{title}</h3>
							<div>
								<Button size="small" onClick={() => setExpanded(false)}>
									<CloseIcon />
								</Button>
							</div>
						</div>
						{data !== undefined ? (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData}>
									<Line type="monotone" dataKey="value" stroke="#8884d8" />
									<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
								</LineChart>
							</ResponsiveContainer>
						) : null}
					</div>
				</Paper>
			</Modal>
		</Card>
	);

	function handleExpandClick() {
		if (!loading) setExpanded(true);
	}
}
