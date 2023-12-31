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
import Chart from "react-google-charts";
import { useMeasure } from "@uidotdev/usehooks";

type Props = {
	title: string;
	loading: boolean;
	data: NameValueModel[] | undefined;
};

export default function BarCard({ title, loading, data }: Props) {
	const [expanded, setExpanded] = useState(false);
	const [ref, { width, height }] = useMeasure();

	const chartHeader = [
		[
			{ type: "date", id: "Date" },
			{ type: "number", id: "Debit" },
		],
	];

	const chartData =
		data === undefined
			? []
			: data.map((row) => {
					return [
						new Date(row.name.split("/").reverse().join("/")),
						parseFloat((Math.round(row.value * 100) / 100).toString()),
					];
			  });

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
					<Chart
						chartLanguage="en-GB"
						chartType="Bar"
						data={[...chartHeader, ...chartData]}
						options={{
							legend: { position: "none" },
						}}
					/>
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
						<div ref={ref} style={{ height: "100%", paddingBottom: "1em" }}>
							{data !== undefined ? (
								<Chart
									chartLanguage="en-GB"
									chartType="Bar"
									data={[...chartHeader, ...chartData]}
									options={{
										legend: { position: "none" },
										height: height! / 1.1,
										width: width!,
									}}
								/>
							) : null}
						</div>
					</div>
				</Paper>
			</Modal>
		</Card>
	);

	function handleExpandClick() {
		if (!loading) setExpanded(true);
	}
}
