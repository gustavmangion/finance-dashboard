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
	TooltipProps,
	XAxis,
	YAxis,
} from "recharts";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { getMoneyFormat } from "../helpers/moneyHelper";

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

	const CustomToolTip = ({
		active,
		payload,
		label,
	}: TooltipProps<ValueType, NameType>) => {
		if (active && payload && payload.length) {
			const value = getMoneyFormat(+payload[0].value!);
			return (
				<div>
					{label instanceof Date ? (
						<p>{`${label.toLocaleDateString()}: ${value}`}</p>
					) : (
						<p>{`${label}: ${value}`}</p>
					)}
				</div>
			);
		}
	};

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
					getChart()
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
						{data !== undefined ? getChart() : null}
					</div>
				</Paper>
			</Modal>
		</Card>
	);

	function handleExpandClick() {
		if (!loading) setExpanded(true);
	}

	function getChart() {
		return (
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={chartData}>
					<Line type="monotone" dataKey="value" stroke="#1c5d99" />
					<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
					<XAxis dataKey="name" tickFormatter={formatXAxis} />
					<YAxis />
					<Tooltip content={<CustomToolTip />} />
				</LineChart>
			</ResponsiveContainer>
		);
	}

	function formatXAxis(item: any) {
		if (item instanceof Date) return item.toLocaleDateString();
		return item;
	}
}
