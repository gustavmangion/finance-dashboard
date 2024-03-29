import {
	Button,
	Card,
	CardContent,
	CircularProgress,
	Modal,
	Paper,
	Tooltip,
} from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import materialStyles from "../styles/material.module.scss";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from "recharts";
import { NameValueModel } from "../apis/base/dashboard/types";
import LoadError from "./loadError";
import NoData from "./noData";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useState } from "react";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
	drillDownAction?: (id: string) => void;
};

export default function DonutCard({
	title,
	loading,
	data,
	drillDownAction,
}: Props) {
	const [expanded, setExpanded] = useState(false);
	const sliceColors = [
		"#1c5d99",
		"#dba11c",
		"#00aea3",
		"#0084b6",
		"#00a9b9",
		"#00cba3",
		"#8fe683",
		"#4e62a7",
		"#bf6bb4",
	];

	const chartData =
		data === undefined
			? []
			: data.map((row) => {
					return {
						id: row.name,
						name: row.name.replace(/([A-ZÖ][a-zö])/g, " $1").trim(),
						value: parseFloat((Math.round(row.value * 100) / 100).toString()),
					};
			  });
	return (
		<Card className={styles.card}>
			<CardContent
				className={[styles.tall, styles.doubleWide, styles.extraPadding].join(
					" "
				)}
			>
				<div className={styles.header}>
					{drillDownAction ? (
						<Tooltip
							title="Drill-Down active: Press on a sector for details"
							placement="right-start"
						>
							<FilterAltIcon className={styles.drillDownActiveIcon} />
						</Tooltip>
					) : null}
					<h4 onClick={handleExpandClick} className={styles.expandable}>
						{title}
						<OpenInFullIcon className={styles.expandIcon} />
					</h4>
				</div>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : data === undefined ? (
					<LoadError />
				) : data.length === 0 ? (
					<NoData />
				) : (
					getChart(false)
				)}
			</CardContent>
			<Modal open={expanded} onClose={() => setExpanded(false)}>
				<Paper className={[materialStyles.modal, styles.expandList].join(" ")}>
					<div className={materialStyles.wide}>
						<div className={styles.header}>
							{drillDownAction ? (
								<Tooltip
									title="Drill-Down active: Press on a sector for details"
									placement="right-start"
								>
									<FilterAltIcon className={styles.drillDownActiveIcon} />
								</Tooltip>
							) : null}
							<h3>{title}</h3>
							<div>
								<Button size="small" onClick={() => setExpanded(false)}>
									<CloseIcon />
								</Button>
							</div>
						</div>
						{data !== undefined ? getChart(true) : null}
					</div>
				</Paper>
			</Modal>
		</Card>
	);

	function handleExpandClick() {
		if (!loading) setExpanded(true);
	}

	function getChart(isExpanded: boolean) {
		return (
			<ResponsiveContainer height="100%">
				<PieChart>
					<Legend layout="horizontal" verticalAlign="top" align="center" />
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						innerRadius={50}
						paddingAngle={isExpanded ? 4 : 8}
						label
						isAnimationActive={!expanded}
						onClick={handleClick}
					>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={sliceColors[index % sliceColors.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		);
	}

	function handleClick(x: any) {
		if (drillDownAction) drillDownAction(x.id);
	}
}
