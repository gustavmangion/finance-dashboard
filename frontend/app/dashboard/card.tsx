import { Card, CardContent } from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { getMoneyFormat } from "../helpers/moneyHelper";

type Props = {
	title: string;
	current: number;
	previous: number;
};

export default function NumberCard({ title, current, previous }: Props) {
	return (
		<Card className={styles.card}>
			<CardContent>
				<h4>{title}</h4>
				<p>
					<strong>{getMoneyFormat(current)}</strong>
				</p>
				<div className={styles.bottom}>
					{getTrendIcon()}
					<small>
						<strong>{getMoneyFormat(previous)}</strong>
					</small>
				</div>
			</CardContent>
		</Card>
	);

	function getTrendIcon() {
		if (current > previous)
			return <TrendingUpIcon className={styles.trendUp} />;
		if (current < previous)
			return <TrendingDownIcon className={styles.trendDown} />;

		return <TrendingFlatIcon className={styles.trendFlat} />;
	}
}
