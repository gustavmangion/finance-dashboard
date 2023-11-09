import { Card, CardContent, CircularProgress } from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { getMoneyFormat } from "../helpers/moneyHelper";
import LoadError from "./loadError";

type Props = {
	title: string;
	loading: boolean;
	current: number | undefined;
	previous: number | undefined;
	inverseTrend?: boolean;
	percentage?: boolean;
};

export default function NumberCard({
	title,
	loading,
	current,
	previous,
	inverseTrend = false,
	percentage = false,
}: Props) {
	return (
		<Card className={styles.card}>
			<CardContent>
				<h4>{title}</h4>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : isNaN(current!) ? (
					<LoadError />
				) : (
					<>
						<p>
							<strong>
								{percentage
									? `${(current! * 100).toFixed(0)} %`
									: getMoneyFormat(current!)}
							</strong>
						</p>
						{getTrendIcon()}
						<small>
							<strong>
								{percentage
									? `${(previous! * 100).toFixed(0)} %`
									: getMoneyFormat(previous!)}
							</strong>
						</small>
					</>
				)}
			</CardContent>
		</Card>
	);

	function getTrendIcon() {
		if (current! > previous!)
			return (
				<TrendingUpIcon
					className={!inverseTrend ? styles.trendUp : styles.trendDown}
				/>
			);
		if (current! < previous!)
			return (
				<TrendingDownIcon
					className={!inverseTrend ? styles.trendDown : styles.trendUp}
				/>
			);

		return <TrendingFlatIcon className={styles.trendFlat} />;
	}
}
